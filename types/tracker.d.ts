import { Events } from "./events";
import { Scroller } from "./scroller";
type TrackerEvent = "move";
export declare class Tracker {
    private readonly scroller;
    private _minPosition;
    private _maxPosition;
    private _minOverflowPosition;
    private _maxOverflowPosition;
    private _position;
    private measurements;
    readonly events: Events<TrackerEvent, this>;
    constructor(scroller: Scroller);
    get position(): number;
    get minPosition(): number;
    get maxPosition(): number;
    get minOverflowPosition(): number;
    get maxOverflowPosition(): number;
    get overflowRatio(): number;
    get velocity(): number;
    velocityToDistanceAndDuration(): {
        distance: number;
        duration: number;
    };
    private measure;
    to(to: number): void;
    move(distance: number): void;
    resize(): void;
}
export {};
