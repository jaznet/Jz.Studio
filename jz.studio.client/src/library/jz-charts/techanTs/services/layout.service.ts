
import { Injectable, NgZone } from "@angular/core";
import { Selection } from 'd3-selection';
import { ReplaySubject } from "rxjs";
import { ChartType } from "../enums/chart-type";
import {  SvgAttributes } from "../interfaces/techan-interfaces";
import { BaseChartLayoutService } from "./charts/base/base-chart-layout-service";
import { ChartScaffold } from "../interfaces/chart-scaffold";
import { SectionAttributes } from "../interfaces/section-attributes";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // #region PROPERTIES
  svgBorder = 8;
  divSvgContainer!: Selection<HTMLDivElement, unknown, null, undefined>;


  gSectionsContainer!: Selection<SVGGElement, unknown, null, undefined>;
  rSectionsContainer!: Selection<SVGRectElement, unknown, null, undefined>;

  gOhlcSection!: Selection<SVGGElement, unknown, null, undefined>;
  rOhlcSection!: Selection<SVGRectElement, unknown, null, undefined>;

  gMacdSection!: Selection<SVGGElement, unknown, null, undefined>;
  rMacdSection!: Selection<SVGRectElement, unknown, null, undefined>;

  ohlc!: SectionAttributes;
  volume!: SectionAttributes;
  macd!: SectionAttributes;
  rsi!: SectionAttributes;

  macdSizeReady$ = new ReplaySubject<{ width: number; height: number }>(1);
  rsiSizeReady$ = new ReplaySubject<{ width: number; height: number }>(1);
  volumeSizeReady$ = new ReplaySubject<{ width: number; height: number }>(1);
  ohlcSizeReady$ = new ReplaySubject<{ width: number; height: number }>(1);

  sizeReady$: Record<ChartType, ReplaySubject<{ width: number; height: number }>> = {
      [ChartType.OHLC]: new ReplaySubject(1),
      [ChartType.VOLUME]: new ReplaySubject(1),
      [ChartType.MACD]: new ReplaySubject(1),
      [ChartType.RSI]: new ReplaySubject(1),
      [ChartType.SMA]: new ReplaySubject(1),
      [ChartType.EMA]: new ReplaySubject(1),
      [ChartType.BOLLINGER_BANDS]: new ReplaySubject(1),
      [ChartType.STOCHASTIC]: new ReplaySubject(1),
      [ChartType.PRICE]: new ReplaySubject(1),
    [ChartType.Base]: new ReplaySubject(1)
  };

  scaffold: ChartScaffold = {
    width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, sectionsContainer: {},
    sections: {
      [ChartType.OHLC]: this.ohlc,
      [ChartType.VOLUME]: this.volume,
      [ChartType.MACD]: this.macd,
      [ChartType.RSI]: this.rsi
    }
  };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };


  spacer = 0;
  spacerAdjusted = 0;

  sma1!: SVGElement;
  sma2!: SVGElement; 
  sma3!: SVGElement;

  // #region Axes
  xAxisMonthsTop!: SVGGElement;
  xAxisMonthsBottom!: SVGGElement;
  xAxisDays!: SVGGElement;
  xAxisTopGroup!: SVGGElement;


  xAxisBottom!: SVGGElement;
  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  rectVolume!: SVGRectElement;
  rMacdContent!: SVGRectElement;
  // #endregion

  constructor(
 //   private ngZone: NgZone,
 ///*   private ohlcChart: OhlcChartService,*/
 //   private ohlcLayout: OhlcChartLayoutService,
 //   private volumeLayout: VolumeChartLayoutService,
 //   private macdLayout: MacdLayoutService,
 //   private rsiLayout: RsiChartLayoutService
  ) { }

  createScaffolding() {
    console.log('%c    ✓ createScaffolding layout service', 'color:#C9B498');
    this.loadSections();
  //  this.sizeSections();
    this.alignChartsToScaffold();
  }

  loadSections() {
    this.scaffold.sections[ChartType.OHLC] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .4
    };
    this.scaffold.sections['VOLUME'] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections[ChartType.MACD] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections['RSI'] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
  }

  getLayoutByChartType(chartType: ChartType): BaseChartLayoutService | undefined {
    switch (chartType) {
      case ChartType.MACD:
      //  return this.macdLayout;
      //case ChartType.VOLUME:
      //  return this.volumeLayout;
      ////case ChartType.OHLC:
      ////  return this.ohlcLayout;
      //case ChartType.RSI:
      //  return this.rsiLayout;
      default:
        console.warn(`Layout service not found for chart type: ${chartType}`);
        return undefined;
    }
  }


  sizeChartSection(chartType: ChartType): void {

    const section = this.scaffold.sections[chartType];
    if (!section) {
      console.warn(`No layout section found for chart type: ${chartType}`);
      return;
    }

    const layout = this.getLayoutByChartType(chartType);
    if (!layout) {
      console.warn(`No layout object found for chart type: ${chartType}`);
      return;
    }

    const width = this.rSectionsContainer!.node()?.width.baseVal.value;
    const height = this.rSectionsContainer!.node()?.height.baseVal.value;

    //layout.rSection.attr('width', `${width}`);
    //layout.rSection.attr('height', `${height}`);

    //scaffoldSection!.width = width;
    //scaffoldSection!.height = height;

    layout.axisLeft.gAxis.attr('width', `${section.margins.right}`);
    layout.axisLeft.gAxis.attr('height', `${height}`);

    layout.axisRight.gAxis.attr('width', `${section.margins.right}`);
    layout.axisRight.gAxis.attr('height', `${height}`);

    layout.rContent.attr('width', `${width! - section.margins.left - section.margins.right}`);
    layout.rContent.attr('height', `${height}`);

  }

  sizeSections(): void {
    console.log('%c    ✓ sizeSections layout service  💡', 'color:#C9B498');
    this.spacer = 8;

    this.scaffold.width = this.divSvgContainer.node()!.clientWidth - (this.svgBorder * 2);
    this.scaffold.height = this.divSvgContainer.node()!.clientHeight - (this.svgBorder * 2);

    // #region MAIN


 

    // X AXIS BOTTOM
    this.xAxisBottomRect.setAttribute('width', `${this.scaffold.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.scaffold.xAxisBottom}`);
    //this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

    // SECTIONS
    //   this.spacerAdjusted = this.spacer * (1 + (1 / this.scaffold.sections.he));
    this.rSectionsContainer.attr('width', `${this.scaffold.width}`);
    this.rSectionsContainer.attr('height', `${this.scaffold.height - this.scaffold.xAxisTop - this.scaffold.xAxisBottom}`);

    this.scaffold.sections[ChartType.OHLC]!.height = (this.rSectionsContainer.node()!.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.OHLC]!.pct;
    this.scaffold.sections[ChartType.OHLC]!.width = this.rSectionsContainer.node()!.width.baseVal.value;

    ////this.rOhlcSection.attr('width', this.rSectionsContainer.node()!.width.baseVal.value);
    ////this.rOhlcSection.attr('height', this.rSectionsContainer.node()!.height.baseVal.value * this.scaffold!.sections![ChartType.OHLC]?.pct!);

    console.log('%c     Sections', 'color:#15795F', this.scaffold.sections[ChartType.OHLC]!.width, this.scaffold.sections[ChartType.OHLC]!.height);

    this.scaffold.sections[ChartType.MACD]!.height = (this.rSectionsContainer.node()!.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.MACD]!.pct;
    this.scaffold.sections[ChartType.MACD]!.width = this.rSectionsContainer.node()!.width.baseVal.value;

    //this.rMacdSection.attr('width', this.rSectionsContainer.node()!.width.baseVal.value);
    //this.rMacdSection.attr('height', this.rSectionsContainer.node()!.height.baseVal.value * this.scaffold!.sections![ChartType.MACD]?.pct!);

    console.log('%c     Sections', 'color:#15795F', this.scaffold.sections[ChartType.MACD]!.width, this.scaffold.sections[ChartType.MACD]!.height);

    // #endregion MAIN

    // #region OHLC
   // this.ohlcLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    //this.ohlcLayout.rSection.attr('height', `${((this.rSectionsContainer.height.baseVal.value - (5 * this.spacer)) * this.scaffold.sections[ChartType.OHLC]!.pct)}`);
    //this.ohlcLayout.rContent.attr('width', `${this.scaffold.sections[ChartType.OHLC]!.width - this.scaffold.sections[ChartType.OHLC]!.margins.left - this.scaffold.sections[ChartType.OHLC]!.margins.right}`);

    //this.scaffold.sections[ChartType.OHLC]!.width = this.ohlcLayout.rSection.node()!.width.baseVal.value;
    //this.scaffold.sections[ChartType.OHLC]!.height = (this.ohlcLayout.rSection.node()!.height.baseVal.value);
    //this.scaffold.sections[ChartType.OHLC]!.content.width = (this.ohlcLayout.rContent.node()!.width.baseVal.value);
    //this.scaffold.sections[ChartType.OHLC]!.content.height = (this.ohlcLayout.rContent.node()!.height.baseVal.value);
    //this.ohlcLayout.rContent.attr('height', `${this.scaffold.sections[ChartType.OHLC]!.height}`);
    //this.ohlcLayout.axisLeft.rAxis.attr('width', `${this.scaffold.sections[ChartType.OHLC]!.margins.right}`);
    //this.ohlcLayout.axisLeft.rAxis.attr('height', `${this.scaffold.sections[ChartType.OHLC]!.height - this.scaffold.sections[ChartType.OHLC]!.margins.top}`);
    //this.ohlcLayout.axisRight.rAxis.attr('width', `${this.scaffold.sections[ChartType.OHLC]!.margins.right}`);
    //this.ohlcLayout.axisRight.rAxis.attr('height', `${this.scaffold.sections[ChartType.OHLC]!.height - this.scaffold.sections[ChartType.OHLC]!.margins.top}`);
    // #endregion OHLC

    // #region VOLUME
    //this.volumeLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    //this.volumeLayout.rSection.attr('height', `${(this.rSectionsContainer.height.baseVal.value * this.scaffold.sections[ChartType.VOLUME]!.pct) - this.spacerAdjusted}`);

    //this.scaffold.sections[ChartType.VOLUME]!.width = this.volumeLayout.rSection.node()!.width.baseVal.value;
    //this.scaffold.sections[ChartType.VOLUME]!.height = this.volumeLayout.rSection.node()!.height.baseVal.value;

    //this.volumeLayout.axisLeft.gAxis.attr('width', `${this.scaffold.sections[ChartType.VOLUME]!.margins.left}`);
    //this.volumeLayout.axisLeft.gAxis.attr('height', `${this.scaffold.sections[ChartType.VOLUME]!.height}`);
    //this.volumeLayout.axisRight.gAxis.attr('width', `${this.scaffold.sections[ChartType.VOLUME]!.margins.right}`);
    //this.volumeLayout.axisRight.gAxis.attr('height', `${this.scaffold.sections[ChartType.VOLUME]!.height}`);
    // #endregion VOLUME  ✅ U+1F4A1

    // #region MACD
  
    //try {
    //  this.ngZone.onStable.pipe(take(1)).subscribe(() => {
    //    setTimeout(() => {
    //      const rSection = this.macdLayout.rSection;
    //      if (!rSection) {
    //        console.warn('⚠️ rSection not found');
    //        return;
    //      }
    //      rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    //      rSection.attr('height', `${(this.rSectionsContainer.height.baseVal.value * this.scaffold.sections[ChartType.MACD]!.pct) - this.spacerAdjusted}`);
    //      console.log('💡', rSection.node()?.width.baseVal.value);
    //      this.scaffold.sections[ChartType.MACD]!.width = this.macdLayout.rSection.node()?.width.baseVal.value ?? 0;
    //      this.scaffold.sections[ChartType.MACD]!.height = this.macdLayout.rSection.node()?.height.baseVal.value ?? 0;

    //      this.macdLayout.axisLeft.gAxis.attr('width', `${this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    //      this.macdLayout.axisLeft.gAxis.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);

    //      this.macdLayout.axisRight.gAxis.attr('width', `${this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    //      this.macdLayout.axisRight.gAxis.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);

    //      this.macdLayout.axisLeft.gAxis.attr('transform', `translate(0,0)`);
    //      //  this.macdChart.gMacdAxisRight.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.right},${this.scaffold.sections[ChartType.MACD]!.margins.top})`);

    //      this.macdLayout.rContent.attr('width', `${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.left - this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    //      this.macdLayout.rContent.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);
    //      console.log('%cMacdLayout', 'color:skyblue', this.macdLayout.rSection);
    //    }, 0);
    //  })
    //}
    //catch (error: any) {
    //  console.error('❌ An error occurred:', error.message);
    //  // console.error('Type:', error.name);
    //  /// console.error('Stack trace:', error.stack);
    //}


    // #endregion MACD

    // #region RSI
    //this.rsiLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    //this.rsiLayout.rSection.attr('height', `${((this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.MACD]!.pct)}`);
    //this.scaffold.sections[ChartType.MACD]!.width = this.rsiLayout.rSection.node()?.width.baseVal.value ?? 0;
    //this.scaffold.sections[ChartType.MACD]!.height = this.rsiLayout.rSection.node()?.height.baseVal.value ?? 0;
    //this.rsiLayout.rContent.attr('width', `${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.left - this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    //this.rsiLayout.rContent.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);
  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.scaffold.height - this.scaffold.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.gSectionsContainer.attr('transform', `translate(0,${this.scaffold.xAxisTop})`)

    //this.ohlcLayout.gSection.attr('transform', `translate(0,${this.spacer})`);
    //this.ohlcLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.OHLC]!.margins.left},0)`);
    //this.ohlcLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.OHLC]!.margins.left + this.scaffold.sections[ChartType.OHLC]!.content.width},0)`);
    //this.ohlcLayout.axisRight.gAxis.attr('transform', 'translate(0)');

    //this.volumeLayout.gSection.attr('transform', `translate(0,${this.scaffold.sections[ChartType.VOLUME]!.height + this.spacer + this.spacer})`);
    //this.volumeLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.VOLUME]!.margins.left},0)`);
    //this.volumeLayout.axisLeft.gAxis.attr('transform', `translate(${this.scaffold.sections[ChartType.VOLUME]!.margins.left},0)`)
    //this.volumeLayout.axisLeft.gAxisGroup.attr('transform', `translate(0)`);
    //this.volumeLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.VOLUME]!.width - this.scaffold.sections[ChartType.VOLUME]!.margins.right})`);

    //try {
    //  this.macdLayout.gSection.attr('transform', `translate(0,  ${(this.scaffold.sections[ChartType.MACD]!.height + this.scaffold.sections[ChartType.MACD]!.height + (this.spacer * 3))})`);
    //  this.macdLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
    //  this.macdLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.right},0)`);
    //  this.macdLayout.axisLeft.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
    //} catch (error: any) {
    //  console.error('❌ An error occurred:', error.message);
    //}

    //this.rsiLayout.gSection.attr('transform', `translate( 0,  ${(this.scaffold.sections[ChartType.OHLC]!.height + this.scaffold.sections[ChartType.VOLUME]!.height + this.scaffold.sections[ChartType.MACD]!.height) + (this.spacer * 4)})`);
    //this.rsiLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.right},${this.scaffold.sections[ChartType.MACD]!.margins.top})`);
    //this.rsiLayout.axisLeft.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
    //this.rsiLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
  }
}
