import { ElementRef, Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ScalesService } from './scales.service';
import { timeFormat } from 'd3-time-format';
import { select, selection, selectAll, Selection } from 'd3-selection';
import { LayoutService } from './layout.service';

@Injectable({
  providedIn: 'root'
})
export class PartsAxesService {

  chartXaxisMonthsTop: any;
  chartXaxisMonthsBottom: any;

  xAxisMonthsTop!: Selection<SVGGElement, unknown, null, undefined>;
  xAxisMonthsBottom!: Selection<SVGGElement, unknown, null, undefined>;
  xAxisDays!: any;
  xAxisBottom: any;

  constructor(
    private scales: ScalesService,
    private layout: LayoutService) { }

  drawAxes(): void {

    this.xAxisMonthsTop = select(this.layout.xAxisMonthsTop);
    this.xAxisMonthsBottom = select(this.layout.xAxisMonthsBottom);
    this.xAxisDays = select(this.layout.xAxisDays);
    this.xAxisBottom = select(this.layout.xAxisBottom);

    const dateFormatter = timeFormat('%b %Y'); // Format as 'Jan 2023'
    const dateFormatterMajor = timeFormat("%b %Y"); // Example: Jan 2023
    const dateFormatterMinor = timeFormat("%d");    // Example: 1, 2, 3...

    // CHART
    let lastMonth = -1;
    let lastYear = -1;

    type CustomAxisDomain = string | number | Date | { valueOf(): number };

    this.chartXaxisMonthsTop = axisTop(this.scales.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain, index: number) => {
        let date: Date;
        if (typeof domainValue === "string") {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === "number") {
          date = new Date(domainValue);
        } else {
          return "";
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonth || currentYear !== lastYear) {
          lastMonth = currentMonth;
          lastYear = currentYear;
          return `${dateFormatterMajor(date)}`; // Example: "Jan 2023"
        } else {
          return ""; // Skip redundant months
        }
      });

    this.chartXaxisMonthsBottom = axisBottom(this.scales.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain, index: number) => {
        let date: Date;
        if (typeof domainValue === "string") {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === "number") {
          date = new Date(domainValue);
        } else {
          return "";
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonth || currentYear !== lastYear) {
          lastMonth = currentMonth;
          lastYear = currentYear;
          return `${dateFormatterMajor(date)}`; // Example: "Jan 2023"
        } else {
          return ""; // Skip redundant months
        }
      });

    // Apply the tick values based on the domain of scaleBand
    const tickValues = this.scales.dateScaleX.domain(); // Get the domain values from scaleBand

    /*DRAW*/
    this.xAxisMonthsTop.call(this.chartXaxisMonthsTop);
    this.xAxisMonthsBottom.call(this.chartXaxisMonthsBottom);
  }
}
