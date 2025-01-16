import { Injectable } from '@angular/core';
import { max, min, extent } from 'd3-array';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
import { CandlestickData } from '../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {
  stockPriceHistoryData: StockPriceHistory[] = [];
  dateExtent!: [undefined, undefined] | [Date, Date];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  maxVolume: number | undefined;
  parsedData!: any[];

  constructor() { }

  scrubData() {
    const priceValues = this.stockPriceHistoryData.map(d => [d.open, d.high, d.low, d.close]).flat();
    this.minPrice = min(priceValues);
    this.maxPrice = max(priceValues);

    // Calculate the maximum volume
    this.maxVolume = max(this.stockPriceHistoryData, d => d.volume); // Assuming `volume` is a property in your data

    this.parsedData = this.stockPriceHistoryData.map(d => ({
      ...d,
      date: new Date(d.date) // Convert date string to Date object
    }));

    // Filter out invalid dates
    this.parsedData = this.parsedData.filter((d: { date: { getTime: () => number; }; }) => !isNaN(d.date.getTime()));

    // Calculate date extent
    this.dateExtent = extent(this.parsedData, (d: CandlestickData) => d.date);

    console.log('Date Extent:', this.dateExtent);
    console.log('Maximum Volume:', this.maxVolume);
  }

}
