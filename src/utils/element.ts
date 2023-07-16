import { ScrollerOptions } from "../scroller";

export function getElementSize(element: HTMLElement, direction: NonNullable<ScrollerOptions["direction"]>) {
  return direction === "x" ? element.offsetWidth : element.offsetHeight;
}
