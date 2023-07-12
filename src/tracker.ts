import { Measurement } from "./measurement";
import { Scroller } from "./scroller";

export class Tracker {
  private _position: number = 0;
  private measurements: Measurement[] = [];

  public get position() {
    return this._position;
  }

  public get velocity() {
    const { distance, duration } = this.measurements.reduce(
      ({ distance, duration, prevTimestamp }, measurement) => {
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

    return distance / duration;
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
    this.measure({ position: this.position, distance, timestamp: Date.now() });
  }
}
