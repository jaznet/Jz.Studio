import { ElementRef, Injectable } from '@angular/core';
import { chart_attributes, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';
import { ChartOhlcService } from './charts/chart-ohlc.service';
import { VolumeChartService } from './charts/chart-volume.service';
import { ChartMacdService } from './charts/chart-macd.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // #region PROPERTIES
  svgContainer: any;
  svgElement!: ElementRef<any>;
  svgElementRect!: SVGRectElement;

  ohlc!: SectionAttributes;
  volume!: SectionAttributes;
  macd!: SectionAttributes;
  rsi!: SectionAttributes;

  chart_attributes: chart_attributes = { width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, sections: [this.ohlc,this.volume,this.macd,this.rsi] };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };

  sectionsContainer!: SVGGElement;
  sectionsContainerRect!: SVGRectElement;
  spacer=0;
  adjSpacer = 0;




  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;







  rsiSection!: SVGGElement;
  rsiSectionContent!: SVGGElement;
  rsiSectionContentRect!: SVGRectElement;

  rsiGroup: any;


  rsiSectionRect!: SVGRectElement;

  // #region Axes
  xAxisMonthsTop!: SVGGElement;
  xAxisMonthsBottom!: SVGGElement;
  xAxisDays!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottom!: SVGGElement;
  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;



  gVolumeAxisLeft!: SVGGElement;
  gVolumeAxisLeft_grp!: SVGGElement;
  volumeAxisRectLeft!: SVGRectElement;

  gVolumeAxisRight!: SVGGElement;
  gVolumeAxisRight_grp!: SVGGElement;
  volumeAxisRectRight!: SVGRectElement;

  gMacdAxisLeft!: SVGGElement;
  gMacdAxisGroupLeft!: SVGGElement;
  macdAxisRectLeft!: SVGRectElement;

  gMacdAxisRight!: SVGGElement;
  macdAxisGroupRight!: SVGGElement;
  macdAxisRectRight!: SVGRectElement;

  gMacdChart: any;

  rsiAxisLeft!: SVGGElement;
  yAxisLeftGroupC!: SVGGElement;
  yAxisLeftRectC!: SVGRectElement;

  rsiAxisRight!: SVGGElement;
  rsiAxisGroupRight!: SVGGElement;
  yAxisRightRectC!: SVGRectElement;

  // #endregion Axes

  rectVolume!: SVGRectElement;
  // #endregion

  constructor(
    private ohlcChart: ChartOhlcService,
    private volumeChart: VolumeChartService,
    private macdChart: ChartMacdService
  ) { }

  createScaffolding() {
    this.loadSections();
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  loadSections() {
    this.chart_attributes.sections[0] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .4
    };
    this.chart_attributes.sections[1] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.chart_attributes.sections[2] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.chart_attributes.sections[3] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
  }

  sizeSections(): void {
    this.spacer = 8;
    this.adjSpacer = this.spacer * (1 + (1 / this.chart_attributes.sections.length));

    this.chart_attributes.width = this.svgContainer.clientWidth;
    this.chart_attributes.height = this.svgContainer.clientHeight - 16;

    // #region MAIN
    this.svgElement.nativeElement.setAttribute('width', `${this.chart_attributes.width}`);
    this.svgElement.nativeElement.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElementRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.svgElementRect.setAttribute('height', `${this.chart_attributes.height}`);

    // X-AXIS TOP
    this.xAxisTopRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.xAxisTopRect.setAttribute('height', `${this.chart_attributes.xAxisTop}`);

    // X AXIS BOTTOM
    this.xAxisBottomRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.chart_attributes.xAxisBottom}`);
    //this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

    // SECTIONS
    this.sectionsContainerRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.sectionsContainerRect.setAttribute('height', `${this.chart_attributes.height - this.chart_attributes.xAxisTop - this.chart_attributes.xAxisBottom}`);
    console.log(this.sectionsContainerRect);
    this.chart_attributes.sections[0].height = this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[0].pct;
    this.chart_attributes.sections[1].height = this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[1].pct;
    this.chart_attributes.sections[2].height = this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[2].pct;
    this.chart_attributes.sections[3].height = this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[3].pct;
    this.chart_attributes.sections[0].width = this.sectionsContainerRect.width.baseVal.value;
    this.chart_attributes.sections[1].width = this.sectionsContainerRect.width.baseVal.value;
    this.chart_attributes.sections[2].width = this.sectionsContainerRect.width.baseVal.value;
    this.chart_attributes.sections[3].width = this.sectionsContainerRect.width.baseVal.value;
    // #endregion MAIN

    // #region OHLC
    this.ohlcChart.ohlcSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.ohlcChart.ohlcSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[0].pct) - this.adjSpacer}`);
    console.log(this.chart_attributes.sections[0].width - this.chart_attributes.sections[0].margins.left - this.chart_attributes.sections[0].margins.right);
    this.ohlcChart.ohlcSectionContentRect.setAttribute('width', `${this.chart_attributes.sections[0].width - this.chart_attributes.sections[0].margins.left - this.chart_attributes.sections[0].margins.right}`);
    this.ohlcChart.ohlcSectionContentRect.setAttribute('height', `${this.chart_attributes.sections[0].height}`);
    this.chart_attributes.sections[0].width = this.ohlcChart.ohlcSectionRect.getBBox().width;
    this.chart_attributes.sections[0].height = this.ohlcChart.ohlcSectionRect.getBBox().height;
    this.ohlcChart.ohlcAxisRectLeft.setAttribute('width', `${this.chart_attributes.sections[0].margins.right}`);
    this.ohlcChart.ohlcAxisRectLeft.setAttribute('height', `${this.chart_attributes.sections[0].height - this.chart_attributes.sections[0].margins.top}`);
    this.ohlcChart.ohlcAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.ohlcChart.ohlcAxisRectRight.setAttribute('width', `${this.chart_attributes.sections[0].margins.right}`);
    this.ohlcChart.ohlcAxisRectRight.setAttribute('height', `${this.chart_attributes.sections[0].height - this.chart_attributes.sections[0].margins.top}`);
    this.ohlcChart.ohlcAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion OHLC

    // #region VOLUME
    this.volumeChart.volumeSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.volumeChart.volumeSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[1].pct) - this.adjSpacer}`);
    this.chart_attributes.sections[1].width = this.volumeChart.volumeSectionRect.getBBox().width;
    this.chart_attributes.sections[1].height = this.volumeChart.volumeSectionRect.getBBox().height;
    this.volumeChart.volumeAxisRectLeft.setAttribute('width', `${this.chart_attributes.sections[1].margins.left}`);
    this.volumeChart.volumeAxisRectLeft.setAttribute('height', `${this.chart_attributes.sections[1].height}`);
    this.volumeChart.volumeAxisRectRight.setAttribute('width', `${this.chart_attributes.sections[1].margins.right}`);
    this.volumeChart.volumeAxisRectRight.setAttribute('height', `${this.chart_attributes.sections[1].height}`);
    // #endregion VOLUME

    // #region MACD
    this.macdChart.rMacdSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.macdChart.rMacdSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[2].pct) - this.adjSpacer}`);
    this.chart_attributes.sections[2].width = this.macdChart.rMacdSectionRect.getBBox().width;
    this.chart_attributes.sections[2].height = this.macdChart.rMacdSectionRect.getBBox().height;

    //this.macdChart.rMacdSectionRect.setAttribute('width',
    //  `${this.chart_attributes.sections[2].width - this.chart_attributes.sections[2].margins.left - this.chart_attributes.sections[2].margins.right}`);
    //this.macdChart.rMacdSectionRect.setAttribute('height', `${this.chart_attributes.sections[2].height}`);
    this.macdChart.macdAxisRectLeft.setAttribute('width', `${this.chart_attributes.sections[2].margins.right}`);
    this.macdChart.macdAxisRectLeft.setAttribute('height', `${this.chart_attributes.sections[2].height}`);
    this.macdChart.macdAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.macdChart.macdAxisRectRight.setAttribute('width', `${this.chart_attributes.sections[2].margins.right}`);
    this.macdChart.macdAxisRectRight.setAttribute('height', `${this.chart_attributes.sections[2].height}`);
    this.macdChart.macdAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion MACD

    // #region RSI
    this.rsiSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.rsiSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[3].pct) - this.adjSpacer}`);
    this.chart_attributes.sections[3].width = this.rsiSectionRect.getBBox().width;
    this.chart_attributes.sections[3].height = this.rsiSectionRect.getBBox().height;
    this.rsiSectionContentRect.setAttribute('width', `${this.chart_attributes.sections[3].width - this.chart_attributes.sections[3].margins.left - this.chart_attributes.sections[3].margins.right}`);
    this.rsiSectionContentRect.setAttribute('height', `${this.chart_attributes.sections[3].height-this.spacer}`);

    /* LEFT  B*/
    this.yAxisLeftRectC.setAttribute('width', `${this.chart_attributes.sections[3].margins.right}`);
    this.yAxisLeftRectC.setAttribute('height', `${this.chart_attributes.sections[3].height}`);
    this.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT B */
    this.yAxisRightRectC.setAttribute('width', `${this.chart_attributes.sections[3].margins.right}`);
    this.yAxisRightRectC.setAttribute('height', `${this.chart_attributes.sections[3].height}`);
    this.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /* LEFT  C*/
    this.yAxisLeftRectC.setAttribute('width', `${this.chart_attributes.sections[3].margins.right}`);
    this.yAxisLeftRectC.setAttribute('height', `${this.chart_attributes.sections[3].height}`);
    this.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT C */
    this.yAxisRightRectC.setAttribute('width', `${this.chart_attributes.sections[3].margins.right}`);
    this.yAxisRightRectC.setAttribute('height', `${this.chart_attributes.sections[3].height}`);
    this.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion RSI
  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.chart_attributes.height - this.chart_attributes.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.sectionsContainer.setAttribute('transform', `translate(0,${this.chart_attributes.xAxisTop})`)

    this.ohlcChart.ohlcSection.setAttribute('transform', `translate(0,${this.spacer})`);
    this.ohlcChart.ohlcSectionContent.setAttribute('transform', `translate(${this.chart_attributes.sections[0].margins.left},0)`);

    //this.ohlcChart.gOhlcAxisLeft.setAttribute('transform', `translate(40,0)`);
    this.ohlcChart.ohlc_yAxisR_grp.setAttribute('transform', `translate(${this.chart_attributes.sections[0].width - this.chart_attributes.sections[0].margins.right},${this.chart_attributes.sections[0].margins.top})`);

    this.volumeChart.volumeSection.setAttribute('transform', `translate(0,${this.chart_attributes.sections[0].height + this.spacer + this.spacer})`);
    this.volumeChart.volumeContent.setAttribute('transform', `translate(${this.chart_attributes.sections[1].margins.left},0)`);
    this.volumeChart.gVolumeAxisLeft
      .attr('transform', `translate(${this.chart_attributes.sections[1].margins.left},0)`)
    /*  .setAttribute('transform', `translate(${this.chart_attributes.sections[1].margins.left},0)`);*/
    this.volumeChart.gVolumeAxisRight_grp.setAttribute('transform', `translate(${this.chart_attributes.sections[1].width - this.chart_attributes.sections[1].margins.right})`);

    this.macdChart.gMacdSection
      .attr('transform',     `translate(0,  ${(this.chart_attributes.sections[0].height + this.chart_attributes.sections[1].height + (this.spacer * 3))})`);
    this.macdChart.gMacdAxisLeft.attr('transform', `translate(${this.chart_attributes.sections[2].margins.left},0)`);
    this.macdChart.gMacdAxisRight.attr('transform',
      `translate(${this.chart_attributes.sections[2].width - this.chart_attributes.sections[2].margins.right},${this.chart_attributes.sections[2].margins.top})`);

    this.rsiSection.setAttribute('transform',
      `translate(0,
        ${ (this.chart_attributes.sections[0].height + this.chart_attributes.sections[1].height + this.chart_attributes.sections[2].height) + (this.spacer*4)})`);
    this.rsiSectionContent.setAttribute('transform', `translate(${this.chart_attributes.sections[3].margins.left},0)`);
    this.rsiAxisGroupRight.setAttribute('transform', `translate(${this.chart_attributes.sections[3].width - this.chart_attributes.sections[3].margins.right},${this.chart_attributes.sections[3].margins.top})`);
    this.rsiAxisLeft.setAttribute('transform', `translate(${this.chart_attributes.sections[3].margins.left},0)`);
  }
}
