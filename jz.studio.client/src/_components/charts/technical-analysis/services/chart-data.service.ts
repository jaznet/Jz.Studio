import { Injectable } from '@angular/core';
import { max, min, extent } from 'd3-array';
import { StockPriceHistory } from '../../../../models/stock-price-history.model';
import { ohlcData } from '../interfaces/techan-interfaces';

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
  macdData!: any[];

  constructor() { }

  scrubData() {
    this.cleanParsedData();
    this.computePriceRange();
    this.computeMaxVolume();
    this.computeDateExtent();
    this.computeMacd();
  }

  private cleanParsedData(): void {
    this.parsedData = this.stockPriceHistoryData
      .map(d => ({
        ...d,
        date: new Date(d.date)
      }))
      .filter(d => !isNaN(d.date.getTime()))
      .filter(d => d.date.getDay() !== 0 && d.date.getDay() !== 6);
  }

  private computePriceRange(): void {
    const priceValues = this.parsedData
      .map(d => [d.open, d.high, d.low, d.close])
      .flat();
    this.minPrice = min(priceValues);
    this.maxPrice = max(priceValues);
  }

  private computeMaxVolume(): void {
    this.maxVolume = max(this.parsedData, d => d.volume);
  }

  private computeDateExtent(): void {
    this.dateExtent = extent(this.parsedData, d => d.date);
    console.log(' %c    Date Extent:', 'color:#15795F', this.dateExtent);
    console.log(' %c    Maximum Volume:', 'color:#15795F', this.maxVolume);
  }

  private computeMacd(): void {
    const shortPeriod = 12;
    const longPeriod = 26;
    const signalPeriod = 9;
    this.macdData = this.calculateMacd(this.parsedData, shortPeriod, longPeriod, signalPeriod);
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
    this.macdData = macdLine.map((macdPoint, index) => ({
      date: macdPoint.date,
      macd: macdPoint.macd,
      signal: signalLine[index],
      histogram: macdPoint.macd - signalLine[index],
    }));

    return this.macdData;
  }


  private calculateEma(
    data: { date: Date; value: number }[],
    period: number
  ): number[] {

    if (!data || data.length === 0) {
      return [];
    }

    const k = 2 / (period + 1);
    const ema: number[] = [];

    let previousEma = data[0].value;

    for (const point of data) {
      const currentEma = (point.value - previousEma) * k + previousEma;

      ema.push(currentEma);

      previousEma = currentEma;
    }

    return ema;
  }


}
