import { Measurement } from "./measurement";
import { Scroller } from "./scroller";

export class Tracker {
  private _position: number = 0;
  private _direction: number = -1;
  private measurements: Measurement[] = [];

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

    console.log(distance, duration, distance / duration, distance / (duration || 1));
    return distance / (duration || 1);
  }

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

  public move({ distance }: { distance: number }) {
    this._position = this._position + distance;
    this._direction = distance >= 0 ? 1 : -1;
    this.measure({ position: this.position, distance, timestamp: Date.now() });
  }
}
