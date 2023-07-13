import { Events } from "./events";
import { Scroller } from "./scroller";

export class Animator {
  private readonly scroller: Scroller;
  private currentAnimation: Animation | null = null;
  private animations: Animation[] = [];

  constructor(scroller: Scroller) {
    this.scroller = scroller;
  }

  public get isActive() {
    return this.currentAnimation?.isActive ?? false;
  }

  public requestNextAnimation() {
    if (this.animations.length === 0) {
      return;
    }

    this.currentAnimation = this.animations.shift()!;
    this.currentAnimation.events.on("animationEnd", this.requestNextAnimation.bind(this));
    this.currentAnimation.start();
  }

  public start(animations: AnimtionMeta[]) {
    if (this.isActive) {
      this.stop();
    }
    this.animations = animations.map((animation) => new Animation(this.scroller, animation));
    this.requestNextAnimation();
  }

  public stop() {
    this.currentAnimation?.stop();
  }
}

interface AnimtionMeta {
  startPosition: number;
  distance: number;
  duration: number;
}

type AnimationEvent = "animationStart" | "animationEnd";

class Animation {
  private scroller: Scroller;
  private startPosition: number;
  private distance: number;
  private duration: number;
  private frameId: number | null = null;
  private startedAt: number | null = null;
  public readonly events: Events<AnimationEvent, this>;

  constructor(scroller: Scroller, { startPosition, distance, duration }: AnimtionMeta) {
    this.startPosition = startPosition;
    this.scroller = scroller;
    this.distance = distance;
    this.duration = duration;
    this.events = new Events(this);
  }

  public get isActive() {
    return this.frameId != null;
  }

  private animate(now: number) {
    if (this.startedAt == null) {
      this.startedAt = now;
      this.events.emit("animationStart");
    }

    const ellapsed = now - this.startedAt;
    const progress = this.duration === 0 ? 1 : ellapsed / this.duration;

    const nextPosition = this.startPosition + this.distance * progress;
    const distance = nextPosition - this.scroller.tracker.position;

    this.scroller.children.forEach((child) => {
      const x = this.scroller.direction === "x" ? nextPosition : 0;
      const y = this.scroller.direction === "y" ? nextPosition : 0;
      child.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    });

    this.scroller.tracker.move({ distance });

    if (progress < 1) {
      this.requestNextFrame();
      return;
    }

    this.startedAt = null;
    this.events.emit("animationEnd");
  }

  private requestNextFrame() {
    this.frameId = window.requestAnimationFrame(this.animate.bind(this));
  }

  private cancelFrame() {
    if (this.frameId != null) {
      window.cancelAnimationFrame(this.frameId);
    }
  }

  public start() {
    this.requestNextFrame();
  }

  public stop() {
    this.cancelFrame();
    this.startedAt = null;
  }
}
