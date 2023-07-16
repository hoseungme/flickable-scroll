import { Measurement } from "./measurement";
import { Scroller } from "./scroller";

export class Tracker {
  private _minPosition: number;
  private _maxPosition: number;
  private _position: number = 0;
  private _direction: number = -1;
  private measurements: Measurement[] = [];

  constructor(scroller: Scroller) {
    const scrollHeight = scroller.children.reduce((a, b) => a + b.offsetHeight, 0) - scroller.container.offsetHeight;

    this._minPosition = scroller.reverse ? 0 : scrollHeight * -1;
    this._maxPosition = scroller.reverse ? scrollHeight : 0;
  }

  public get minPosition() {
    return this._minPosition;
  }

  public get maxPosition() {
    return this._maxPosition;
  }

  public get position() {
    return this._position;
  }

  public get direction() {
    return this._direction;
  }

  public get velocity() {
    const { distance, duration } = this.measurements.reduce(
      ({ distance, duration, prevTimestamp }, measurement) => {
        if (Date.now() - measurement.timestamp >= 200) {
          return { distance, duration, prevTimestamp };
        }

        if (this.sign(distance) !== this.sign(measurement.distance)) {
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
    const absVelocity = Math.abs(this.velocity);
    const decelerationRate = 0.000000147 + absVelocity / 1000;
    return {
      distance: (Math.pow(absVelocity, 2) / decelerationRate) * this._direction,
      duration: absVelocity / decelerationRate,
    };
  }

  private sign(num: number) {
    return num >= 0 ? 0 : 1;
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
    this._direction = distance >= 0 ? 1 : -1;
    this.measure({ position: this.position, distance, timestamp: Date.now() });
  }

  public move(distance: number) {
    this._position = this._position + distance;
    this._direction = distance >= 0 ? 1 : -1;
    this.measure({ position: this.position, distance, timestamp: Date.now() });
  }
}
