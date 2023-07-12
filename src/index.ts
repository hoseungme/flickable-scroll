import { Scroller, ScrollerOptions, TouchScroller } from "./scroller";

export class FlickTouchScroll {
  private scroller: Scroller;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    this.scroller = new TouchScroller(container, options);
  }

  public destroy() {
    this.scroller.destroy();
  }
}
