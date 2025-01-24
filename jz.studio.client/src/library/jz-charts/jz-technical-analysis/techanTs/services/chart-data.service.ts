import { Injectable } from '@angular/core';
import { max, min, extent } from 'd3-array';
import { StockPriceHistory } from '../../../../../models/stock-price-history.model';
import { olhcData } from '../interfaces/techan-interfaces';

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
    this.dateExtent = extent(this.parsedData, (d: olhcData) => d.date);

    console.log('Date Extent:', this.dateExtent);
    console.log('Maximum Volume:', this.maxVolume);
  }

  private calculateMacd(data: { date: Date; close: number }[], shortPeriod: number, longPeriod: number, signalPeriod: number): any[] {
    const emaShort = this.calculateEma(data.map(d => ({ date: d.date, value: d.close })), shortPeriod);
    const emaLong = this.calculateEma(data.map(d => ({ date: d.date, value: d.close })), longPeriod);

    // Calculate MACD line
    const macdLine = emaShort.map((shortVal, index) => ({
      date: data[index].date,
      macd: shortVal - emaLong[index],
    }));

    // Calculate Signal line
    const signalLine = this.calculateEma(macdLine.map(d => ({ date: d.date, value: d.macd })), signalPeriod);

    // Calculate Histogram
    const macdData = macdLine.map((macdPoint, index) => ({
      date: macdPoint.date,
      macd: macdPoint.macd,
      signal: signalLine[index],
      histogram: macdPoint.macd - signalLine[index],
    }));

    return macdData;
  }


  private calculateEma(data: { date: Date; value: number }[], period: number): number[] {
    const k = 2 / (period + 1); // Smoothing constant
    const ema = [];
    let previousEma = data[0].value; // Use the first data point's value as the seed value

    for (const point of data) {
      const currentEma = (point.value - previousEma) * k + previousEma;
      ema.push(currentEma);
      previousEma = currentEma;
    }

    return ema;
  }


}
