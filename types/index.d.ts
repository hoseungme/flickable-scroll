import { ScrollerOptions, ScrollEvent } from "./scroller";
declare class FlickableScroller {
    private readonly scroller;
    constructor(container: HTMLElement, options?: ScrollerOptions);
    destroy(): void;
}
export { FlickableScroller };
export type { ScrollerOptions, ScrollEvent };
