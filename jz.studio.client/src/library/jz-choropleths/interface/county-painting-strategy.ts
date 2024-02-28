
export interface CountyPaintingStrategy {
  popups: string;
  getColor(countyData: any): string;
  getData(popover_loading: any, popover_httperror: any, callback: (data: any) => void): void;
}
