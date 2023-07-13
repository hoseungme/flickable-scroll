import { Animator } from "./animator";
import { Events } from "./events";
import { Tracker } from "./tracker";

export interface ScrollerOptions {
  direction?: "x" | "y";
}

type ScrollEvent = "scrollStart" | "scrollMove" | "scrollEnd";

export class Scroller {
  public readonly container: HTMLElement;
  public readonly children: HTMLElement[];
  public readonly tracker: Tracker;
  public readonly animator: Animator;
  public readonly events: Events<ScrollEvent, Scroller>;
  protected readonly options: ScrollerOptions;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    this.container = container;
    this.children = Array.prototype.slice.call(this.container.children);
    this.tracker = new Tracker();
    this.animator = new Animator(this);
    this.events = new Events<ScrollEvent, Scroller>(this);
    this.options = options != null ? options : { direction: "y" };
  }

  public get direction() {
    return this.options.direction ?? "y";
  }

  protected start() {
    this.animator.stop();
    this.events.emit("scrollStart");
  }

  protected move({ distance }: { distance: number }) {
    this.animator.start([{ startPosition: this.tracker.position, distance, duration: 0 }]);
    this.events.emit("scrollMove");
  }

  protected end() {
    const { distance, duration } = this.tracker.velocityToDistanceAndDuration();
    this.animator.start([{ startPosition: this.tracker.position, distance, duration }]);
    this.events.emit("scrollEnd");
  }

  public destroy() {
    this.events.purge();
    this.animator.stop();
  }
}

export class TouchScroller extends Scroller {
  private currentTouchPosition: number | null = null;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    super(container, options);

    this.container.addEventListener("touchstart", this.touchstart.bind(this));
    this.container.addEventListener("touchmove", this.touchmove.bind(this));
    this.container.addEventListener("touchend", this.touchend.bind(this));
  }

  private parseTouch(touch: Touch) {
    return { position: this.options.direction === "x" ? touch.clientX : touch.clientY };
  }

  private touchstart(e: TouchEvent) {
    const touch = this.parseTouch(e.changedTouches[0]);

    this.currentTouchPosition = touch.position;

    this.start();
  }

  private touchmove(e: TouchEvent) {
    if (this.currentTouchPosition == null) {
      return;
    }

    const touch = this.parseTouch(e.changedTouches[0]);
    const distance = touch.position - this.currentTouchPosition;

    this.move({ distance });

    this.currentTouchPosition = touch.position;
  }

  private touchend() {
    this.currentTouchPosition = null;
    this.end();
  }

  public destroy() {
    this.container.removeEventListener("touchstart", this.touchstart.bind(this));
    this.container.removeEventListener("touchmove", this.touchmove.bind(this));
    this.container.removeEventListener("touchend", this.touchend.bind(this));
    super.destroy();
  }
}
