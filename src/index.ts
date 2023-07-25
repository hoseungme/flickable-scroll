import { MouseScroller, Scroller, ScrollerOptions, ScrollEvent, TouchScroller } from "./scroller";

class FlickableScroller {
  private readonly scroller: Scroller;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    this.scroller = this.isTouchDevice ? new TouchScroller(container, options) : new MouseScroller(container, options);
  }

  private get isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  public lock() {
    this.scroller.lock();
  }

  public unlock() {
    this.scroller.unlock();
  }

  public destroy() {
    this.scroller.destroy();
  }
}

export { FlickableScroller };

export type { ScrollerOptions, ScrollEvent };
