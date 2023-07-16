import { Animator, AnimationMeta } from "./animator";
import { Events } from "./events";
import { Tracker } from "./tracker";
import { clamp } from "./utils/clamp";
import { easeOutCubic } from "./utils/easing";
import { sign } from "./utils/sign";

export interface ScrollerOptions {
  direction?: "x" | "y";
  reverse?: boolean;
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
    this.options = options != null ? options : { direction: "y", reverse: false };
    this.tracker = new Tracker(this);
    this.animator = new Animator(this);
    this.events = new Events<ScrollEvent, Scroller>(this);
  }

  public get reverse() {
    return this.options.reverse ?? false;
  }

  public get direction() {
    return this.options.direction ?? "y";
  }

  protected start() {
    this.animator.stop();
    this.events.emit("scrollStart");
  }

  protected move({ distance }: { distance: number }) {
    const distanceRatio = sign(this.tracker.position) !== sign(distance) ? 1 : 1 - this.tracker.overflowRatio;

    this.animator.start([{ startPosition: this.tracker.position, distance: distance * distanceRatio, duration: 0 }]);
    this.events.emit("scrollMove");
  }

  protected end() {
    if (this.tracker.position < this.tracker.startPosition) {
      const distance = this.tracker.startPosition - this.tracker.position;

      this.animator.start([{ startPosition: this.tracker.position, distance, duration: 200, easing: easeOutCubic }]);
    } else if (this.tracker.position > this.tracker.endPosition) {
      const distance = this.tracker.endPosition - this.tracker.position;

      this.animator.start([{ startPosition: this.tracker.position, distance, duration: 200, easing: easeOutCubic }]);
    } else {
      const animations: AnimationMeta[] = [];

      const { distance, duration } = this.tracker.velocityToDistanceAndDuration();
      animations.push({ startPosition: this.tracker.position, distance, duration, easing: easeOutCubic });

      const nextPosition = this.tracker.position + distance;
      if (nextPosition < this.tracker.startPosition) {
        const startPosition = clamp(nextPosition, this.tracker.minPosition, this.tracker.startPosition);
        const distance = this.tracker.startPosition - startPosition;

        animations.push({ startPosition, distance, duration: 300, easing: easeOutCubic });
      } else if (nextPosition > this.tracker.endPosition) {
        const startPosition = clamp(nextPosition, this.tracker.endPosition, this.tracker.maxPosition);
        const distance = this.tracker.endPosition - startPosition;

        animations.push({ startPosition, distance, duration: 300, easing: easeOutCubic });
      }

      this.animator.start(animations);
    }

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
