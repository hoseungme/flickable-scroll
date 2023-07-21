import { Scroller } from "./scroller";
export declare class Animator {
    private readonly scroller;
    private currentAnimation;
    private animations;
    constructor(scroller: Scroller);
    get isActive(): boolean;
    requestNextAnimation(): void;
    start(animations: AnimationMeta[]): void;
    stop(): void;
}
export interface AnimationMeta {
    startPosition: number;
    distance: number;
    duration: number;
    easing?: (x: number) => number;
}
