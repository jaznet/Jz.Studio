import { Injectable } from '@angular/core';
import { axisBottom, axisTop } from 'd3-axis';
import { scaleBand, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';

import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';
import { StockPriceHistory } from '../../models/stock-price-history.model';

@Injectable({ providedIn: 'root' })
export class ChartXAxisService {
  createScale(
    data: readonly StockPriceHistory[] | null | undefined,
    scaffold: ChartScaffold
  ): ScaleBand<Date> {
    const contentWidth = Math.max(0, scaffold.width ?? 0);
    const dates = (data ?? []).map(item =>
      item.date instanceof Date ? item.date : new Date(item.date)
    );

    return scaleBand<Date>()
      .domain(dates)
      .range([
        0,
        contentWidth - scaffold.margins.left - scaffold.margins.right
      ])
      .paddingInner(0.2)
      .paddingOuter(0.1)
      .align(0.5);
  }

  renderMonthlyAxes(
    topElement: SVGGElement,
    bottomElement: SVGGElement,
    scale: ScaleBand<Date>
  ): void {
    const dates = scale.domain();
    if (dates.length === 0) return;

    const spanDays = this.spanDays(dates);
    const tickValues = this.selectLabelDates(dates, scale, spanDays);
    const tickFormat = spanDays <= 120
      ? timeFormat('%b %-d')
      : spanDays <= 730
        ? timeFormat('%b %Y')
        : timeFormat('%Y');

    const topAxis = axisTop(scale)
      .tickValues(tickValues)
      .tickFormat(tickFormat)
      .tickSize(5)
      .tickSizeOuter(0);
    const bottomAxis = axisBottom(scale)
      .tickValues(tickValues)
      .tickFormat(tickFormat)
      .tickSize(5)
      .tickSizeOuter(0);

    select(topElement).call(topAxis);
    select(bottomElement).call(bottomAxis);
  }

  private spanDays(dates: readonly Date[]): number {
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    return Math.max(
      1,
      (lastDate.getTime() - firstDate.getTime()) / 86_400_000
    );
  }

  private selectLabelDates(
    dates: readonly Date[],
    scale: ScaleBand<Date>,
    spanDays: number
  ): Date[] {
    const candidates = dates.filter((date, index) => {
      if (index === 0) return true;

      const previous = dates[index - 1];
      if (spanDays <= 120) {
        return this.weekKey(date) !== this.weekKey(previous);
      }
      if (spanDays <= 730) {
        return date.getMonth() !== previous.getMonth()
          || date.getFullYear() !== previous.getFullYear();
      }
      return date.getFullYear() !== previous.getFullYear();
    });

    const minimumSpacing = spanDays <= 120 ? 70 : 82;
    const selected: Date[] = [];

    for (const candidate of candidates) {
      const position = scale(candidate);
      if (position === undefined) continue;

      const previous = selected[selected.length - 1];
      const previousPosition = previous ? scale(previous) : undefined;
      if (
        previousPosition !== undefined
        && position - previousPosition < minimumSpacing
      ) {
        selected[selected.length - 1] = candidate;
      } else {
        selected.push(candidate);
      }
    }

    return selected;
  }

  private weekKey(date: Date): string {
    const startOfWeek = new Date(date);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().slice(0, 10);
  }
}
