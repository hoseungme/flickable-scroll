import { Events } from "./events";
import {
  Scroller,
  ScrollerEvent,
  ScrollerOptions,
  TouchScroller,
} from "./scroller";

export class FlickableScroller {
  private readonly scroller: Scroller;
  public readonly events: Events<ScrollerEvent, Scroller>;

  constructor(container: HTMLElement, options?: ScrollerOptions) {
    this.scroller = new TouchScroller(container, options);
    this.events = this.scroller.events;
  }

  public destroy() {
    this.scroller.destroy();
  }
}
