import { Animator } from "./animator";
import { Events } from "./events";
import { Tracker } from "./tracker";
export interface ScrollerOptions {
    direction?: "x" | "y";
    reverse?: boolean;
    onScrollStart?: (e: ScrollEvent) => void;
    onScrollMove?: (e: ScrollEvent) => void;
    onScrollEnd?: (e: ScrollEvent) => void;
}
type ScrollerEvent = "scrollStart" | "scrollMove" | "scrollEnd";
export interface ScrollEvent {
    position: number;
    minPosition: number;
    maxPosition: number;
    minOverflowPosition: number;
    maxOverflowPosition: number;
    isScrollTop: boolean;
    isScrollBottom: boolean;
}
export declare class Scroller {
    readonly container: HTMLElement;
    readonly children: HTMLElement[];
    readonly tracker: Tracker;
    readonly animator: Animator;
    readonly events: Events<ScrollerEvent, Scroller>;
    protected readonly options: ScrollerOptions;
    constructor(container: HTMLElement, options?: ScrollerOptions);
    get reverse(): boolean;
    get direction(): "x" | "y";
    protected start(): void;
    protected move({ distance }: {
        distance: number;
    }): void;
    protected end(): void;
    destroy(): void;
}
export declare class TouchScroller extends Scroller {
    private currentTouchPosition;
    constructor(container: HTMLElement, options?: ScrollerOptions);
    private parseTouch;
    private touchstart;
    private touchmove;
    private touchend;
    destroy(): void;
}
export {};
