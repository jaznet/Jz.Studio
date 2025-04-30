import { ElementRef, Injectable } from '@angular/core';
import { scaffold, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';
import { ChartOhlcService } from './charts/chart-ohlc.service';
import { VolumeChartService } from './charts/chart-volume.service';
import { ChartMacdService } from './charts/chart-macd.service';
import { ChartRsiIndic } from './charts/chart-rsi-indicator.service';
import { Selection } from 'd3-selection';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // #region PROPERTIES
  svgBorder = 8;
  divSvgContainer!: Selection<HTMLDivElement, unknown, null, undefined>;
  svgElement!: Selection<SVGElement, unknown, null, undefined>;
  rSvgElement!: Selection<SVGRectElement, unknown, null, undefined>;

  ohlc!: SectionAttributes;
  volume!: SectionAttributes;
  macd!: SectionAttributes;
  rsi!: SectionAttributes;

  scaffold: scaffold = {
    width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, sectionsContainer: {}, sections: [this.ohlc,this.volume,this.macd,this.rsi] };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };

  sectionsContainer!: SVGGElement;
  sectionsContainerRect!: SVGRectElement;
  spacer=0;
  spacerAdjusted = 0;

  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;

  // #region Axes
  xAxisMonthsTop!: SVGGElement;
  xAxisMonthsBottom!: SVGGElement;
  xAxisDays!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottom!: SVGGElement;
  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  rectVolume!: SVGRectElement;
  // #endregion

  constructor(
    private ohlcChart: ChartOhlcService,
    private volumeChart: VolumeChartService,
    private macdChart: ChartMacdService,
    private rsiChart: ChartRsiIndic
  ) { }

  createScaffolding() {
    this.loadSections();
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  loadSections() {
    this.scaffold.sections[0] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .4
    };
    this.scaffold.sections[1] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections[2] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections[3] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
  }

  sizeSections(): void {
    this.spacer = 8;

    this.scaffold.width = this.divSvgContainer.node()!.clientWidth - (this.svgBorder*2);
    this.scaffold.height = this.divSvgContainer.node()!.clientHeight - (this.svgBorder * 2);

    // #region MAIN
    this.svgElement.attr('width', `${this.scaffold.width}`);
    this.svgElement.attr('height', `${this.scaffold.height}`);
    this.rSvgElement.attr('width', `${this.scaffold.width}`);
    this.rSvgElement.attr('height', `${this.scaffold.height}`);

    // X-AXIS TOP
    this.xAxisTopRect.setAttribute('width', `${this.scaffold.width}`);
    this.xAxisTopRect.setAttribute('height', `${this.scaffold.xAxisTop}`);

    // X AXIS BOTTOM
    this.xAxisBottomRect.setAttribute('width', `${this.scaffold.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.scaffold.xAxisBottom}`);
    //this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

    // SECTIONS
    this.spacerAdjusted = this.spacer * (1 + (1 / this.scaffold.sections.length));
    this.sectionsContainerRect.setAttribute('width', `${this.scaffold.width}`);
    this.sectionsContainerRect.setAttribute('height', `${this.scaffold.height - this.scaffold.xAxisTop - this.scaffold.xAxisBottom}`);
    console.log(this.sectionsContainerRect);
    this.scaffold.sections[0].height = (this.sectionsContainerRect.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[0].pct;
    this.scaffold.sections[1].height = (this.sectionsContainerRect.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[1].pct;
    this.scaffold.sections[2].height = (this.sectionsContainerRect.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[2].pct;
    this.scaffold.sections[3].height = (this.sectionsContainerRect.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[3].pct;

    this.scaffold.sections[0].width = this.sectionsContainerRect.width.baseVal.value;
    this.scaffold.sections[1].width = this.sectionsContainerRect.width.baseVal.value;
    this.scaffold.sections[2].width = this.sectionsContainerRect.width.baseVal.value;
    this.scaffold.sections[3].width = this.sectionsContainerRect.width.baseVal.value;
    // #endregion MAIN

    // #region OHLC
    this.ohlcChart.rOhlcSection.attr('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.ohlcChart.rOhlcSection.attr('height', `${(this.sectionsContainerRect.height.baseVal.value * this.scaffold.sections[0].pct) - this.spacerAdjusted}`);
    console.log(this.scaffold.sections[0].width - this.scaffold.sections[0].margins.left - this.scaffold.sections[0].margins.right);
    this.ohlcChart.rOhlcSectionContent.attr('width', `${this.scaffold.sections[0].width - this.scaffold.sections[0].margins.left - this.scaffold.sections[0].margins.right}`);

    console.log(this.ohlcChart.rOhlcSection.node()!.height.baseVal.value);
    this.scaffold.sections[0].width = this.ohlcChart.rOhlcSection.node()!.width.baseVal.value;
    this.scaffold.sections[0].height = (this.ohlcChart.rOhlcSection.node()!.height.baseVal.value) - (5 * this.spacer);

    this.ohlcChart.rOhlcSectionContent.attr('height', `${this.scaffold.sections[0].height}`);
    this.ohlcChart.ohlcAxisRectLeft.setAttribute('width', `${this.scaffold.sections[0].margins.right}`);
    this.ohlcChart.ohlcAxisRectLeft.setAttribute('height', `${this.scaffold.sections[0].height - this.scaffold.sections[0].margins.top}`);
    this.ohlcChart.ohlcAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.ohlcChart.ohlcAxisRectRight.setAttribute('width', `${this.scaffold.sections[0].margins.right}`);
    this.ohlcChart.ohlcAxisRectRight.setAttribute('height', `${this.scaffold.sections[0].height - this.scaffold.sections[0].margins.top}`);
    this.ohlcChart.ohlcAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion OHLC

    // #region VOLUME
    this.volumeChart.volumeSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.volumeChart.volumeSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.scaffold.sections[1].pct) - this.spacerAdjusted}`);
    this.scaffold.sections[1].width = this.volumeChart.volumeSectionRect.getBBox().width;
    this.scaffold.sections[1].height = this.volumeChart.volumeSectionRect.getBBox().height;
    this.volumeChart.volumeAxisRectLeft.setAttribute('width', `${this.scaffold.sections[1].margins.left}`);
    this.volumeChart.volumeAxisRectLeft.setAttribute('height', `${this.scaffold.sections[1].height}`);
    this.volumeChart.volumeAxisRectRight.setAttribute('width', `${this.scaffold.sections[1].margins.right}`);
    this.volumeChart.volumeAxisRectRight.setAttribute('height', `${this.scaffold.sections[1].height}`);
    // #endregion VOLUME

    // #region MACD
    this.macdChart.rMacdSectionRect.attr('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.macdChart.rMacdSectionRect.attr('height', `${(this.sectionsContainerRect.height.baseVal.value * this.scaffold.sections[2].pct) - this.spacerAdjusted}`);
    this.scaffold.sections[2].width = this.macdChart.rMacdSectionRect.node()?.width.baseVal.value ?? 0;
    this.scaffold.sections[2].height = this.macdChart.rMacdSectionRect.node()?.height.baseVal.value ?? 0;

    this.macdChart.rMacdAxisRectLeft.attr('width', `${this.scaffold.sections[2].margins.right}`);
    this.macdChart.rMacdAxisRectLeft.attr('height', `${this.scaffold.sections[2].height}`);

    this.macdChart.rMacdAxisRectRight.attr('width', `${this.scaffold.sections[2].margins.right}`);
    this.macdChart.rMacdAxisRectRight.attr('height', `${this.scaffold.sections[2].height}`);
    this.macdChart.gMacdSection.attr('transform', `translate(0,  ${(this.scaffold.sections[0].height + this.scaffold.sections[1].height + (this.spacer * 3))})`);
    this.macdChart.gMacdAxisLeft.attr('transform', `translate(${this.scaffold.sections[2].margins.left},0)`);
    //  this.macdChart.gMacdAxisRight.attr('transform', `translate(${this.scaffold.sections[2].width - this.scaffold.sections[2].margins.right},${this.scaffold.sections[2].margins.top})`);
    this.macdChart.gMacdAxisGroupRight.attr('transform', `translate(${this.scaffold.sections[2].width - this.scaffold.sections[2].margins.right},0)`);
    this.macdChart.rMacdContentRect.attr('width', `${this.scaffold.sections[2].width - this.scaffold.sections[2].margins.left - this.scaffold.sections[2].margins.right}`);
    this.macdChart.rMacdContentRect.attr('height', `${this.scaffold.sections[2].height}`);
    this.macdChart.gMacdContent.attr('transform', `translate(${this.scaffold.sections[2].margins.left},0)`);
    // #endregion MACD

    // #region RSI
    this.rsiChart.rRsiSectionRect.attr('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.rsiChart.rRsiSectionRect.attr('height', `${((this.sectionsContainerRect.height.baseVal.value - (this.spacer*5)) * this.scaffold.sections[3].pct) }`);
    this.scaffold.sections[3].width = this.rsiChart.rRsiSectionRect.node()?.width.baseVal.value ?? 0;
    this.scaffold.sections[3].height = this.rsiChart.rRsiSectionRect.node()?.height.baseVal.value ?? 0;
    this.rsiChart.rRsiSectionContent.attr('width', `${this.scaffold.sections[3].width - this.scaffold.sections[3].margins.left - this.scaffold.sections[3].margins.right}`);
    this.rsiChart.rRsiSectionContent.attr('height', `${this.scaffold.sections[3].height}`);

    /* LEFT  B*/
    this.rsiChart.yAxisLeftRectC.setAttribute('width', `${this.scaffold.sections[3].margins.right}`);
    this.rsiChart.yAxisLeftRectC.setAttribute('height', `${this.scaffold.sections[3].height}`);
    this.rsiChart.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT B */
    this.rsiChart.yAxisRightRectC.setAttribute('width', `${this.scaffold.sections[3].margins.right}`);
    this.rsiChart.yAxisRightRectC.setAttribute('height', `${this.scaffold.sections[3].height}`);
    this.rsiChart.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /* LEFT  C*/
    this.rsiChart.yAxisLeftRectC.setAttribute('width', `${this.scaffold.sections[3].margins.right}`);
    this.rsiChart.yAxisLeftRectC.setAttribute('height', `${this.scaffold.sections[3].height}`);
    this.rsiChart.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT C */
    this.rsiChart.yAxisRightRectC.setAttribute('width', `${this.scaffold.sections[3].margins.right}`);
    this.rsiChart.yAxisRightRectC.setAttribute('height', `${this.scaffold.sections[3].height}`);
    this.rsiChart.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion RSI
  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.scaffold.height - this.scaffold.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.sectionsContainer.setAttribute('transform', `translate(0,${this.scaffold.xAxisTop})`)

    this.ohlcChart.ohlcSection.setAttribute('transform', `translate(0,${this.spacer})`);
    this.ohlcChart.ohlcSectionContent.setAttribute('transform', `translate(${this.scaffold.sections[0].margins.left},0)`);

    //this.ohlcChart.gOhlcAxisLeft.setAttribute('transform', `translate(40,0)`);
    this.ohlcChart.ohlc_yAxisR_grp.setAttribute('transform', `translate(${this.scaffold.sections[0].width - this.scaffold.sections[0].margins.right},${this.scaffold.sections[0].margins.top})`);

    this.volumeChart.volumeSection.setAttribute('transform', `translate(0,${this.scaffold.sections[0].height + this.spacer + this.spacer})`);
    this.volumeChart.volumeContent.setAttribute('transform', `translate(${this.scaffold.sections[1].margins.left},0)`);
    this.volumeChart.gVolumeAxisLeft
      .attr('transform', `translate(${this.scaffold.sections[1].margins.left},0)`)
    /*  .setAttribute('transform', `translate(${this.scaffold.sections[1].margins.left},0)`);*/
    this.volumeChart.gVolumeAxisRight_grp.setAttribute('transform', `translate(${this.scaffold.sections[1].width - this.scaffold.sections[1].margins.right})`);

    this.rsiChart.gRsiSection.attr('transform', `translate(
      0,
      ${(this.scaffold.sections[0].height + this.scaffold.sections[1].height + this.scaffold.sections[2].height) + (this.spacer * 4)})`);
    this.rsiChart.rsiAxisGroupRight.setAttribute('transform', `translate(${this.scaffold.sections[3].width - this.scaffold.sections[3].margins.right},${this.scaffold.sections[3].margins.top})`);
    this.rsiChart.gRsiAxisLeft.attr('transform', `translate(${this.scaffold.sections[3].margins.left},0)`);
    this.rsiChart.gRsiSectionContent.attr('transform', `translate(${this.scaffold.sections[3].margins.left},0)`);
  }
}
