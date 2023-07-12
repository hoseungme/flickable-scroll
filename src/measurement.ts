export class Measurement {
  public readonly position: number;
  public readonly distance: number;
  public readonly timestamp: number;

  constructor({ position, distance, timestamp }: { position: number; distance: number; timestamp: number }) {
    this.position = position;
    this.distance = distance;
    this.timestamp = timestamp;
  }
}
