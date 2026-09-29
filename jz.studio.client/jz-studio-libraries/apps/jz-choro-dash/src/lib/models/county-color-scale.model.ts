export interface CountyColorStop {
  maximum: number;
  color: string;
}

export interface CountyColorScale {
  getColor(value: number): string;
}
