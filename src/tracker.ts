import { Events } from "./events";
import { Measurement } from "./measurement";
import { Scroller } from "./scroller";
import { getElementSize } from "./utils/element";
import { sign } from "./utils/sign";

type TrackerEvent = "move";

export class Tracker {
  private readonly scroller: Scroller;
  private _startPosition: number;
  private _endPosition: number;
  private _minPosition: number;
  private _maxPosition: number;
  private _position: number = 0;
  private measurements: Measurement[] = [];
  public readonly events: Events<TrackerEvent, this>;

  constructor(scroller: Scroller) {
    this.scroller = scroller;
    const containerSize = getElementSize(this.scroller.container, this.scroller.direction);
    const scrollSize =
      this.scroller.children.reduce((a, b) => a + getElementSize(b, this.scroller.direction), 0) - containerSize;

    this._startPosition = this.scroller.reverse ? 0 : scrollSize * -1;
    this._endPosition = this.scroller.reverse ? scrollSize : 0;

    const maxOverflow = containerSize / 2;
    this._minPosition = maxOverflow * (this.scroller.reverse ? -1 : 1);
    this._maxPosition = this._endPosition + maxOverflow * (this.scroller.reverse ? 1 : -1);

    this.events = new Events(this);
  }

  public get position() {
    return this._position;
  }

  public get minPosition() {
    return this._minPosition;
  }

  public get maxPosition() {
    return this._maxPosition;
  }

  public get startPosition() {
    return this._startPosition;
  }

  public get endPosition() {
    return this._endPosition;
  }

  public get overflowRatio() {
    const maxOverflow = getElementSize(this.scroller.container, this.scroller.direction) / 2;

    if (this._position < this._startPosition) {
      return Math.abs((this._position - this._startPosition) / maxOverflow);
    }

    if (this._position > this._endPosition) {
      return Math.abs((this._position - this._endPosition) / maxOverflow);
    }

    return 0;
  }

  public get velocity() {
    const { distance, duration } = this.measurements.reduce(
      ({ distance, duration, prevTimestamp }, measurement) => {
        if (Date.now() - measurement.timestamp >= 200) {
          return { distance, duration, prevTimestamp };
        }

        if (sign(distance) !== sign(measurement.distance)) {
          distance = 0;
          duration = 0;
          prevTimestamp = null;
        }

        return {
          distance: distance + measurement.distance,
          duration: prevTimestamp != null ? duration + (measurement.timestamp - prevTimestamp) : 0,
          prevTimestamp: measurement.timestamp,
        };
      },
      { distance: 0, duration: 0, prevTimestamp: null as number | null }
    );

    return distance / (duration || 1);
  }

  // Thanks to
  // https://github.com/rcbyr/keen-slider/blob/2e6b0d05658a1eaf3d400c05d1cc07e42ac98fb3/src/plugins/modes.ts#L153-L160
  public velocityToDistanceAndDuration() {
    const velocity = this.velocity;
    const absVelocity = Math.abs(velocity);
    const decelerationRate = 0.000000147 + absVelocity / 1000;
    return {
      distance: (Math.pow(absVelocity, 2) / decelerationRate) * sign(velocity),
      duration: absVelocity / decelerationRate,
    };
  }

  private measure(measurement: Measurement) {
    this.measurements.push(measurement);

    if (this.measurements.length >= 10) {
      this.measurements = this.measurements.slice(-10);
    }
  }

  public to(to: number) {
    const distance = to - this._position;

    this._position = to;
    this.measure({ position: this.position, distance, timestamp: Date.now() });
  }

  public move(distance: number) {
    this._position = this._position + distance;
    this.measure({ position: this.position, distance, timestamp: Date.now() });
    this.events.emit("move");
  }
}
