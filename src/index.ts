import { Scroller, ScrollerOptions, ScrollEvent, TouchScroller } from "./scroller";

class FlickableScroller {
  private readonly scroller: Scroller;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    this.scroller = new TouchScroller(container, options);
  }

  public destroy() {
    this.scroller.destroy();
  }
}

export { FlickableScroller };

export type { ScrollerOptions, ScrollEvent };
