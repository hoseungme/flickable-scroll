import { Scroller, ScrollerOptions, ScrollEvent, TouchScroller } from "./scroller";

class FlickableScroller {
  private readonly scroller: Scroller;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    this.scroller = new TouchScroller(container, options);
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
