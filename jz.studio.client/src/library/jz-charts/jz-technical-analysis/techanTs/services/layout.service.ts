import { ElementRef, Injectable } from '@angular/core';
import { chart_attributes, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // #region PROPERTIES
  svgContainer: any;
  svgElement!: ElementRef<any>;
  svgElementRect!: SVGRectElement;

  chart_attributes: chart_attributes = { width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, charts: [.4, .2, .2, .2] };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };

  sections!: SVGGElement;
  sectionsRect!: SVGRectElement;

  ohlcSectionAttributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  ohlcSection!: SVGGElement;
  ohlcSectionRect!: SVGRectElement;
  ohlcSectionContent!: SVGGElement;
  ohlcSectionContentRect!: SVGRectElement;

  /*  ohlcRect!: SVGRectElement;*/

  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;

  volumeSectionAttributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  volumeSection!: SVGGElement;
  volumeSectionRect!: SVGRectElement;
  volumeContent!: SVGGElement;
  volumeContentRect!: SVGRectElement;

  macdSectionAttributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  macdSection!: SVGGElement;
  sectionContentB!: SVGGElement;
  sectionContentBRect!: SVGRectElement;
  sectAttr_B: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  macdChart: any;

  sectionC!: SVGGElement;
  sectionContentC!: SVGGElement;
  sectionContentCRect!: SVGRectElement;
  sectAttr_C: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  rsiGroup: any;

  sectionRectB!: SVGRectElement;
  sectionRectC!: SVGRectElement;

  // #region Axes
  xAxisMonthsTop!: SVGGElement;
  xAxisMonthsBottom!: SVGGElement;
  xAxisDays!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottom!: SVGGElement;
  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  ohlc_yAxisL!: SVGGElement;
  ohlc_yAxisL_grp!: SVGGElement;
  ohlc_yAxisL_rct!: SVGRectElement;

  ohlc_yAxisR!: SVGGElement;
  ohlc_yAxisR_grp!: SVGGElement;
  ohlc_yAxisR_rct!: SVGRectElement;

  volume_yAxisL!: SVGGElement;
  volume_yAxisL_grp!: SVGGElement;
  volume_yAxisL_rct!: SVGRectElement;

  volume_yAxisR!: SVGGElement;
  volume_yAxisR_grp!: SVGGElement;
  volume_yAxisR_rct!: SVGRectElement;

  yAxisLeftB!: SVGGElement;
  yAxisLeftGroupB!: SVGGElement;
  yAxisLeftRectB!: SVGRectElement;

  yAxisRightB!: SVGGElement;
  yAxisRightGroupB!: SVGGElement;
  yAxisRightRectB!: SVGRectElement;

  yAxisLeftC!: SVGGElement;
  yAxisLeftGroupC!: SVGGElement;
  yAxisLeftRectC!: SVGRectElement;

  yAxisRightC!: SVGGElement;
  yAxisRightGroupC!: SVGGElement;
  yAxisRightRectC!: SVGRectElement;

  // #endregion Axes

  rectVolume!: SVGRectElement;
  // #endregion

  constructor() { }

  createScaffolding() {
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  sizeSections(): void {
    this.chart_attributes.width = this.svgContainer.clientWidth - 16;
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
    this.sectionsRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.sectionsRect.setAttribute('height', `${this.chart_attributes.height - this.chart_attributes.xAxisTop - this.chart_attributes.xAxisBottom}`);

    // #endregion MAIN
    // #region OHLC
    this.ohlcSectionRect.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.ohlcSectionRect.setAttribute('height', `${this.sectionsRect.height.baseVal.value * this.chart_attributes.charts[0]}`);
    this.ohlcSectionContentRect.setAttribute('width', `${this.ohlcSectionAttributes.width - this.ohlcSectionAttributes.margins.left - this.ohlcSectionAttributes.margins.right}`);
    this.ohlcSectionContentRect.setAttribute('height', `${this.ohlcSectionAttributes.height}`);
    this.ohlcSectionAttributes.width = this.ohlcSectionRect.getBBox().width;
    this.ohlcSectionAttributes.height = this.ohlcSectionRect.getBBox().height;
    //this.ohlcRect.setAttribute('width', (this.ohlcSectionContentRect.width.baseVal.valueAsString));
    //this.ohlcRect.setAttribute('height', ((this.ohlcSectionContentRect.height.baseVal.value * .75)).toString());
    //this.ohlcRect.setAttribute('fill', 'var(--plt-chart-1)');
    // #endregion OHLC

    // #region VOLUME
    this.volumeSectionRect.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.volumeSectionRect.setAttribute('height', `${this.sectionsRect.height.baseVal.value * this.chart_attributes.charts[1]}`);
    this.volumeSectionAttributes.width = this.volumeSectionRect.getBBox().width;
    this.volumeSectionAttributes.height = this.volumeSectionRect.getBBox().height;
    this.volume_yAxisL_rct.setAttribute('width', `${this.volumeSectionAttributes.margins.left}`);
    this.volume_yAxisL_rct.setAttribute('height', `${this.volumeSectionAttributes.height}`);
    this.volume_yAxisR_rct.setAttribute('width', `${this.volumeSectionAttributes.margins.right}`);
    this.volume_yAxisR_rct.setAttribute('height', `${this.volumeSectionAttributes.height}`);
    // #endregion VOLUME

    this.sectionRectB.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectB.setAttribute('height', `${this.sectionsRect.height.baseVal.value * this.chart_attributes.charts[2]}`);
    this.sectionRectC.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectC.setAttribute('height', `${this.sectionsRect.height.baseVal.value * this.chart_attributes.charts[3]}`);

    // SECTION A
    let bboxA = this.ohlcSectionRect.getBBox();

    // SECTION B
    let bboxB = this.sectionRectB.getBBox();
    this.sectAttr_B.width = bboxB.width;
    this.sectAttr_B.height = bboxB.height;
    console.log(this.ohlcSectionAttributes.height);

    // SECTION C
    let bboxC = this.sectionRectC.getBBox();
    this.sectAttr_C.width = bboxC.width;
    this.sectAttr_C.height = bboxC.height;

    //BODY

    this.sectionContentBRect.setAttribute('width', `${this.sectAttr_B.width - this.sectAttr_B.margins.left - this.sectAttr_B.margins.right}`);
    this.sectionContentBRect.setAttribute('height', `${this.sectAttr_B.height}`);
    this.sectionContentCRect.setAttribute('width', `${this.sectAttr_C.width - this.sectAttr_C.margins.left - this.sectAttr_C.margins.right}`);
    this.sectionContentCRect.setAttribute('height', `${this.sectAttr_C.height}`);
    console.log('sectionContentARect', this.ohlcSectionContentRect);

    /* LEFT A */
    this.ohlc_yAxisL_rct.setAttribute('width', `${this.ohlcSectionAttributes.margins.right}`);
    this.ohlc_yAxisL_rct.setAttribute('height', `${this.ohlcSectionAttributes.height - this.ohlcSectionAttributes.margins.top}`);
    this.ohlc_yAxisL_rct.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT A */
    this.ohlc_yAxisR_rct.setAttribute('width', `${this.ohlcSectionAttributes.margins.right}`);
    this.ohlc_yAxisR_rct.setAttribute('height', `${this.ohlcSectionAttributes.height - this.ohlcSectionAttributes.margins.top}`);
    this.ohlc_yAxisR_rct.setAttribute('fill', 'var(--plt-clr-2)');

    /* LEFT  B*/
    this.yAxisLeftRectB.setAttribute('width', `${this.sectAttr_B.margins.right}`);
    this.yAxisLeftRectB.setAttribute('height', `${this.sectAttr_B.height}`);
    this.yAxisLeftRectB.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT B */
    this.yAxisRightRectB.setAttribute('width', `${this.sectAttr_B.margins.right}`);
    this.yAxisRightRectB.setAttribute('height', `${this.sectAttr_B.height}`);
    this.yAxisRightRectB.setAttribute('fill', 'var(--plt-clr-2)');

    /* LEFT  B*/
    this.yAxisLeftRectC.setAttribute('width', `${this.sectAttr_C.margins.right}`);
    this.yAxisLeftRectC.setAttribute('height', `${this.sectAttr_C.height}`);
    this.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT B */
    this.yAxisRightRectC.setAttribute('width', `${this.sectAttr_C.margins.right}`);
    this.yAxisRightRectC.setAttribute('height', `${this.sectAttr_C.height}`);
    this.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /* LEFT  C*/
    this.yAxisLeftRectC.setAttribute('width', `${this.sectAttr_C.margins.right}`);
    this.yAxisLeftRectC.setAttribute('height', `${this.sectAttr_C.height}`);
    this.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');

    /*  RIGHT C */
    this.yAxisRightRectC.setAttribute('width', `${this.sectAttr_C.margins.right}`);
    this.yAxisRightRectC.setAttribute('height', `${this.sectAttr_C.height}`);
    this.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');

  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.chart_attributes.height - this.chart_attributes.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.sections.setAttribute('transform', `translate(0,${this.chart_attributes.xAxisTop})`)

    this.ohlcSection.setAttribute('transform', `translate(0,0)`);
    this.ohlcSectionContent.setAttribute('transform', `translate(${this.ohlcSectionAttributes.margins.left},0)`);

    this.ohlc_yAxisL_grp.setAttribute('transform', `translate(${this.ohlcSectionAttributes.margins.left},0)`);
    this.ohlc_yAxisR_grp.setAttribute('transform', `translate(${this.ohlcSectionAttributes.width - this.ohlcSectionAttributes.margins.right},${this.ohlcSectionAttributes.margins.top})`);

    this.volumeSection.setAttribute('transform', `translate(0,${this.ohlcSectionAttributes.height})`);
    this.volumeContent.setAttribute('transform', `translate(${this.volumeSectionAttributes.margins.left},0)`);
    this.volume_yAxisL.setAttribute('transform', `translate(${this.volumeSectionAttributes.margins.left})`);
    this.volume_yAxisR.setAttribute('transform', `translate(${this.volumeSectionAttributes.width - this.volumeSectionAttributes.margins.right})`);

    this.yAxisRightGroupB.setAttribute('transform', `translate(${this.sectAttr_B.width - this.sectAttr_B.margins.right},${this.sectAttr_B.margins.top})`);
    this.yAxisRightGroupC.setAttribute('transform', `translate(${this.sectAttr_C.width - this.sectAttr_C.margins.right},${this.sectAttr_C.margins.top})`);

    this.yAxisLeftB.setAttribute('transform', `translate(${this.sectAttr_B.margins.left},0)`);
    this.yAxisLeftC.setAttribute('transform', `translate(${this.sectAttr_C.margins.left},0)`);

    this.macdSection.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * (this.chart_attributes.charts[0] + this.chart_attributes.charts[1])})`);
    this.sectionContentB.setAttribute('transform', `translate(${this.sectAttr_B.margins.left},0)`);

    this.sectionC.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * (this.chart_attributes.charts[0] + this.chart_attributes.charts[1] + this.chart_attributes.charts[2])})`);
    this.sectionContentC.setAttribute('transform', `translate(${this.sectAttr_C.margins.left},0)`);
    // this.sectionC.setAttribute('transform', `translate(32,528.75  )`);

    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);
    // this.macdChart.setAttribute('transform', `translate(32,391.5)`);
  }
}
