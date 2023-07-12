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

  public destroy() {
    this.events.purge();
    this.animator.stop();
  }
}

export class TouchScroller extends Scroller {
  private currentTouchPosition: number | null = null;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    super(container, options);

    this.container.addEventListener("touchstart", this.start.bind(this));
    this.container.addEventListener("touchmove", this.move.bind(this));
    this.container.addEventListener("touchend", this.end.bind(this));
  }

  private parseTouch(touch: Touch) {
    return { position: this.options.direction === "x" ? touch.clientX : touch.clientY };
  }

  private start(e: TouchEvent) {
    const touch = this.parseTouch(e.changedTouches[0]);

    this.currentTouchPosition = touch.position;

    this.events.emit("scrollStart");
  }

  private move(e: TouchEvent) {
    if (this.currentTouchPosition == null) {
      return;
    }

    const touch = this.parseTouch(e.changedTouches[0]);
    const distance = touch.position - this.currentTouchPosition;

    this.currentTouchPosition = touch.position;
    this.animator.start([{ startPosition: this.tracker.position, distance, duration: 0 }]);

    this.events.emit("scrollMove");
  }

  private end() {
    this.currentTouchPosition = null;

    this.events.emit("scrollEnd");
  }

  public destroy() {
    this.container.removeEventListener("touchstart", this.start);
    this.container.removeEventListener("touchmove", this.move);
    this.container.removeEventListener("touchend", this.end);
    super.destroy();
  }
}
