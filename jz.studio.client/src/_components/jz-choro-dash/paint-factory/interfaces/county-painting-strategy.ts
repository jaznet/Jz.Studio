
export interface CountyPaintingStrategy {
  popups: string;
  getColor(countyData: any): string;
  getData( callback: (data: any) => void): void;
}
