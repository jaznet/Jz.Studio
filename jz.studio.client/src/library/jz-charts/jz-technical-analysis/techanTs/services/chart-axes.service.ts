import { ElementRef, Injectable } from '@angular/core';
import { axisBottom, axisRight, axisLeft, axisTop } from 'd3-axis';
import { ChartScalesService } from './chart-scales.service';
import { timeFormat } from 'd3-time-format';
import { select, selection, selectAll } from 'd3-selection';
import { ChartLayoutService } from './chart-layout.service';
import { AxisDomain, Selection } from 'd3-v4';
import { lab } from 'd3';

@Injectable({
  providedIn: 'root'
})
export class ChartAxesService {

  chartXaxisMonthsTop: any;
  chartXaxisMonthsBottom: any;

  ohlc_yAxis_left: any;
  yAxisRightA: any;

  macdYaxisLeft: any;
  macdYaxisRight: any;

  rsiYaxisLeft: any;
  rsiYaxisRight: any;

  xAxisMonths!: any;
  xAxisDays!: any;
  xAxisBottom: any;



  yAxisVolLeftA: any;
  yAxisVolRightA: any;

  yAxisLeftB: any;
  yAxisRightB: any;

  yAxisLeftC: any;
  yAxisRightC: any;

  constructor(
    private scales: ChartScalesService,
    private layout: ChartLayoutService) { }

  drawAxes(): void {

    this.xAxisMonths = select(this.layout.xAxisMonths);
    this.xAxisDays = select(this.layout.xAxisDays);
    this.xAxisBottom = select(this.layout.xAxisBottom);

    this.ohlc_yAxis_left = select(this.layout.ohlc_yAxis_left);
    this.yAxisRightA = select(this.layout.yAxisRightA);

    this.yAxisVolLeftA = select(this.layout.yAxisVolLeftA);
    this.yAxisVolRightA = select(this.layout.yAxisVolRightA);

    this.yAxisLeftB = select(this.layout.yAxisLeftB);
    this.yAxisRightB = select(this.layout.yAxisRightB);

    this.yAxisLeftC = select(this.layout.yAxisLeftC);
    this.yAxisRightC = select(this.layout.yAxisRightC);

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
        }      });

    // Apply the tick values based on the domain of scaleBand
    const tickValues = this.scales.dateScaleX.domain(); // Get the domain values from scaleBand

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



    this.macdYaxisLeft = axisLeft(this.scales.macdYscale);
    this.macdYaxisRight = axisRight(this.scales.macdYscale);

    this.rsiYaxisLeft = axisLeft(this.scales.rsiYscale);
    this.rsiYaxisRight = axisRight(this.scales.rsiYscale);

    /*DRAW*/
    this.xAxisMonths.call(this.chartXaxisMonthsTop);
    this.xAxisBottom.call(this.chartXaxisMonthsBottom);


  
    this.yAxisLeftB.call(this.macdYaxisLeft);
    this.yAxisRightB.call(this.macdYaxisRight);

    this.yAxisLeftC.call(this.rsiYaxisLeft);
    this.yAxisRightC.call(this.rsiYaxisRight);

  }
}
