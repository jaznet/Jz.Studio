import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SmaChartService {
  calculateSma(data: { close: number }[], windowSize: number): { date: Date; value: number }[] {
    if (!data || data.length < windowSize) return [];

    const smaValues = [];
    for (let i = 0; i <= data.length - windowSize; i++) {
      const windowData = data.slice(i, i + windowSize);
      const average =
        windowData.reduce((sum, point) => sum + point.close, 0) / windowSize;
      smaValues.push({
        date: new Date(data[i + windowSize - 1].date),
        value: average,
      });
    }
    return smaValues;
  }
}
