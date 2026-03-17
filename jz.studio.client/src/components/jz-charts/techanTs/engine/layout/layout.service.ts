
import { Injectable, NgZone } from "@angular/core";
import { Selection } from 'd3-selection';
import { ReplaySubject } from "rxjs";
import { ChartType } from "../../enums/chart-type";
import { ChartScaffold } from "../../interfaces/chart-scaffold.interface";
import { PanelAttributes } from "../../interfaces/panel-attributes";
import { SvgAttributes } from "../../interfaces/techan-interfaces";
import { BaseChartLayoutService } from "../../services/charts/base/base-chart-layout-service";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // #region PROPERTIES
  svgBorder = 8;
  divSvgContainer!: Selection<HTMLDivElement, unknown, null, undefined>;


  gMacdSection!: Selection<SVGGElement, unknown, null, undefined>;
  rMacdSection!: Selection<SVGRectElement, unknown, null, undefined>;

  ohlc!: PanelAttributes;
  volume!: PanelAttributes;
  macd!: PanelAttributes;
  rsi!: PanelAttributes;

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
    title: 36, // Title height
    width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40,
    margins: { bottom: 30, left: 30, right: 30, top: 30, },
    panelsContainer: {},
    panels: {
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

  xAxisDays!: SVGGElement;
/*  gXaxisTop!: SVGGElement;*/

  xAxisBottom!: SVGGElement;
  gXaxisBottom!: SVGGElement;
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




    const layout = this.getLayoutByChartType(chartType);
    if (!layout) {
      console.warn(`No layout object found for chart type: ${chartType}`);
      return;
    }

    const width = 0;
    const height = 0;

    //layout.rSection.attr('width', `${width}`);
    //layout.rSection.attr('height', `${height}`);

    //scaffoldSection!.width = width;
    //scaffoldSection!.height = height;



  }

  _sizeSections(): void {
    console.log('%c    ✓ sizeSections layout service  💡', 'color:#C9B498');
    this.spacer = 8;



    // #region MAIN


 

    // X AXIS BOTTOM

    //this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

    // SECTIONS
    //   this.spacerAdjusted = this.spacer * (1 + (1 / this.scaffold.sections!.he));


    ////this.rOhlcSection.attr('width', this.rPanelsContainer.node()!.width.baseVal.value);
    ////this.rOhlcSection.attr('height', this.rPanelsContainer.node()!.height.baseVal.value * this.scaffold!.sections![ChartType.OHLC]?.pct!);



    //this.rMacdSection.attr('width', this.rPanelsContainer.node()!.width.baseVal.value);
    //this.rMacdSection.attr('height', this.rPanelsContainer.node()!.height.baseVal.value * this.scaffold!.sections![ChartType.MACD]?.pct!);

    // #endregion MAIN

    // #region OHLC
   // this.ohlcLayout.rSection.attr('width', `${this.rPanelsContainer.width.baseVal.value}`);
    //this.ohlcLayout.rSection.attr('height', `${((this.rPanelsContainer.height.baseVal.value - (5 * this.spacer)) * this.scaffold.sections[ChartType.OHLC]!.pct)}`);
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
    //this.volumeLayout.rSection.attr('width', `${this.rPanelsContainer.width.baseVal.value}`);
    //this.volumeLayout.rSection.attr('height', `${(this.rPanelsContainer.height.baseVal.value * this.scaffold.sections[ChartType.VOLUME]!.pct) - this.spacerAdjusted}`);

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
    //      rSection.attr('width', `${this.rPanelsContainer.width.baseVal.value}`);
    //      rSection.attr('height', `${(this.rPanelsContainer.height.baseVal.value * this.scaffold.sections[ChartType.MACD]!.pct) - this.spacerAdjusted}`);
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
    //this.rsiLayout.rSection.attr('width', `${this.rPanelsContainer.width.baseVal.value}`);
    //this.rsiLayout.rSection.attr('height', `${((this.rPanelsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.MACD]!.pct)}`);
    //this.scaffold.sections[ChartType.MACD]!.width = this.rsiLayout.rSection.node()?.width.baseVal.value ?? 0;
    //this.scaffold.sections[ChartType.MACD]!.height = this.rsiLayout.rSection.node()?.height.baseVal.value ?? 0;
    //this.rsiLayout.rContent.attr('width', `${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.left - this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    //this.rsiLayout.rContent.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);
  }

  alignChartsToScaffold(): void {
/*    this.gXaxisTop.setAttribute('transform', `translate(0,0)`);*/



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
