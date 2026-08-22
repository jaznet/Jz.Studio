import { Injectable } from '@angular/core';
import { axisBottom, axisTop } from 'd3-axis';
import { scaleBand, type ScaleBand } from 'd3-scale';
import { select } from 'd3-selection';
import { timeFormat } from 'd3-time-format';

import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';
import { StockPriceHistory } from '../../models/stock-price-history.model';

type AxisDomainValue = string | number | Date | { valueOf(): number };

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
    const topAxis = axisTop(scale).tickFormat(this.createMonthlyFormatter());
    const bottomAxis = axisBottom(scale).tickFormat(this.createMonthlyFormatter());

    select(topElement).call(topAxis);
    select(bottomElement).call(bottomAxis);
  }

  private createMonthlyFormatter(): (value: AxisDomainValue) => string {
    const formatMonth = timeFormat('%b %Y');
    let lastMonth = -1;
    let lastYear = -1;

    return value => {
      const date = this.toDate(value);
      if (!date) return '';

      const month = date.getMonth();
      const year = date.getFullYear();
      if (month === lastMonth && year === lastYear) return '';

      lastMonth = month;
      lastYear = year;
      return formatMonth(date);
    };
  }

  private toDate(value: AxisDomainValue): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    return null;
  }
}
