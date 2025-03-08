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

  chartXaxisTop: any;
  chartXaxisBottom: any;

  chartYaxisLeft: any;
  chartYaxisRight: any;

  macdYaxisLeft: any;
  macdYaxisRight: any;

  rsiYaxisLeft: any;
  rsiYaxisRight: any;

  xAxisTop!: any;
  xAxisBottom: any;

  yAxisLeftA: any;
  yAxisRightA: any;

  yAxisLeftB: any;
  yAxisRightB: any;

  yAxisLeftC: any;
  yAxisRightC: any;

  constructor(
    private scales: ChartScalesService,
    private layout: ChartLayoutService) { }

  drawAxes(): void {

    this.xAxisTop = select(this.layout.xAxisTop);
    this.xAxisBottom = select(this.layout.xAxisBottom);

    this.yAxisLeftA = select(this.layout.yAxisLeftA);
    this.yAxisRightA = select(this.layout.yAxisRightA);

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

    this.chartXaxisTop = axisTop(this.scales.dateScaleX)
      .tickFormat((domainValue: CustomAxisDomain, index: number) => {
        let date: Date;

        if (typeof domainValue === "string") {
          date = new Date(domainValue);
        } else if (domainValue instanceof Date) {
          date = domainValue;
        } else if (typeof domainValue === "number") {
          date = new Date(domainValue);
        } else {
          return ""; // Skip invalid ticks
        }

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        if (currentMonth !== lastMonth || currentYear !== lastYear) {
          // First tick of the month → Show month and year
          lastMonth = currentMonth;
          lastYear = currentYear;
          return dateFormatterMajor(date); // Example: "Jan 2023"
        } else {
          // Other ticks within the same month → Show just the day
          return date.getDate().toString(); // Example: "5"
        }
      });




    // Apply the tick values based on the domain of scaleBand
    const tickValues = this.scales.dateScaleX.domain(); // Get the domain values from scaleBand
    this.chartXaxisTop.tickValues(tickValues);




 

    this.chartXaxisBottom = axisBottom(this.scales.dateScaleX)
      .ticks(5)
      .tickFormat((domainValue, index) => dateFormatter(domainValue as Date));

    this.chartYaxisLeft = axisLeft(this.scales.ohlcYscale);
    this.chartYaxisRight = axisRight(this.scales.ohlcYscale);

    this.macdYaxisLeft = axisLeft(this.scales.macdYscale);
    this.macdYaxisRight = axisRight(this.scales.macdYscale);

    this.rsiYaxisLeft = axisLeft(this.scales.rsiYscale);
    this.rsiYaxisRight = axisRight(this.scales.rsiYscale);





    this.xAxisTop.call(this.chartXaxisTop);
    this.xAxisBottom.call(this.chartXaxisBottom);

    this.yAxisLeftA.call(this.chartYaxisLeft);
    this.yAxisRightA.call(this.chartYaxisRight);
  
    this.yAxisLeftB.call(this.macdYaxisLeft);
    this.yAxisRightB.call(this.macdYaxisRight);

    this.yAxisLeftC.call(this.rsiYaxisLeft);
    this.yAxisRightC.call(this.rsiYaxisRight);

  }
}
