import {
  CountyColorScale,
  CountyColorStop
} from '../../models/county-color-scale.model';

export class ThresholdCountyColorScale implements CountyColorScale {
  constructor(private readonly stops: readonly CountyColorStop[]) {
    if (stops.length === 0) {
      throw new Error('A county color scale requires at least one stop.');
    }
  }

  getColor(value: number): string {
    const stop = this.stops.find(candidate => value <= candidate.maximum);

    return stop?.color ?? this.stops[this.stops.length - 1].color;
  }
}
