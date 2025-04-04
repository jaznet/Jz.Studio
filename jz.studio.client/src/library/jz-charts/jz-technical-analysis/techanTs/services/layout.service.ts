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

  chart_attributes: chart_attributes = { width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, sections: [.4, .2, .2, .2] };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };

  sections!: SVGGElement;
  sectionsRect!: SVGRectElement;
  spacer=0;
  adjSpacer = 0;

  ohlcSectionAttributes: SectionAttributes = {
    x: 0, y: 0, width: 0, height: 0,
    margins: { top: 0, right: 40, bottom: 0, left: 40 },
    content: { width: 0, height: 0, x: 0, y: 0 }
  };
  ohlcSection!: SVGGElement;
  ohlcSectionRect!: SVGRectElement;
  ohlcSectionContent!: SVGGElement;
  ohlcSectionContentRect!: SVGRectElement;

  /*  ohlcRect!: SVGRectElement;*/

  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;

  volumeSectionAttributes: SectionAttributes = {
    x: 0, y: 0, width: 0, height: 0,
    margins: { top: 0, right: 40, bottom: 0, left: 40 },
    content: { width: 0, height: 0, x: 0, y: 0 }
  };
  volumeSection!: SVGGElement;
  volumeSectionRect!: SVGRectElement;
  volumeContent!: SVGGElement;
  volumeContentRect!: SVGRectElement;

  macdSectionAttributes: SectionAttributes = {
    x: 0, y: 0, width: 0, height: 0,
    margins: { top: 0, right: 40, bottom: 0, left: 40 },
    content: { width: 0, height: 0, x: 0, y: 0 }
  };
  macdSection!: SVGGElement;
  macdContent!: SVGGElement;
  macdContentRect!: SVGRectElement;

  macdChart: any;

  sectionC!: SVGGElement;
  sectionContentC!: SVGGElement;
  sectionContentCRect!: SVGRectElement;
  sectAttr_C: SectionAttributes = {
    x: 0, y: 0, width: 0, height: 0,
    margins: { top: 0, right: 40, bottom: 0, left: 40 },
    content: { width: 0, height: 0, x: 0, y: 0 }
  };
  rsiGroup: any;

  macdSectionRect!: SVGRectElement;
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

  ohlcAxisLeft!: SVGGElement;
  ohlc_yAxisL_grp!: SVGGElement;
  ohlcAxisRectLeft!: SVGRectElement;

  ohlcAxisRight!: SVGGElement;
  ohlc_yAxisR_grp!: SVGGElement;
  ohlcAxisRectRight!: SVGRectElement;

  volume_yAxisL!: SVGGElement;
  volume_yAxisL_grp!: SVGGElement;
  volumeAxisRectLeft!: SVGRectElement;

  volume_yAxisR!: SVGGElement;
  volume_yAxisR_grp!: SVGGElement;
  volumeAxisRectRight!: SVGRectElement;

  macdAxisLeft!: SVGGElement;
  macdAxisGroupLeft!: SVGGElement;
  macdAxisRectLeft!: SVGRectElement;

  macdAxisRight!: SVGGElement;
  macdAxisGroupRight!: SVGGElement;
  macdAxisRectRight!: SVGRectElement;

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
    this.sectionsRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.sectionsRect.setAttribute('height', `${this.chart_attributes.height - this.chart_attributes.xAxisTop - this.chart_attributes.xAxisBottom }`);

    // #endregion MAIN

    // #region OHLC
    this.ohlcSectionRect.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.ohlcSectionRect.setAttribute('height', `${(this.sectionsRect.height.baseVal.value * this.chart_attributes.sections[0]) - this.adjSpacer}`);
    this.ohlcSectionContentRect.setAttribute('width', `${this.ohlcSectionAttributes.width - this.ohlcSectionAttributes.margins.left - this.ohlcSectionAttributes.margins.right}`);
    this.ohlcSectionContentRect.setAttribute('height', `${this.ohlcSectionAttributes.height}`);
    this.ohlcSectionAttributes.width = this.ohlcSectionRect.getBBox().width;
    this.ohlcSectionAttributes.height = this.ohlcSectionRect.getBBox().height;
    this.ohlcAxisRectLeft.setAttribute('width', `${this.ohlcSectionAttributes.margins.right}`);
    this.ohlcAxisRectLeft.setAttribute('height', `${this.ohlcSectionAttributes.height - this.ohlcSectionAttributes.margins.top}`);
    this.ohlcAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.ohlcAxisRectRight.setAttribute('width', `${this.ohlcSectionAttributes.margins.right}`);
    this.ohlcAxisRectRight.setAttribute('height', `${this.ohlcSectionAttributes.height - this.ohlcSectionAttributes.margins.top}`);
    this.ohlcAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion OHLC

    // #region VOLUME
    this.volumeSectionRect.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.volumeSectionRect.setAttribute('height', `${(this.sectionsRect.height.baseVal.value * this.chart_attributes.sections[1]) - this.adjSpacer}`);
    this.volumeSectionAttributes.width = this.volumeSectionRect.getBBox().width;
    this.volumeSectionAttributes.height = this.volumeSectionRect.getBBox().height;
    this.volumeAxisRectLeft.setAttribute('width', `${this.volumeSectionAttributes.margins.left}`);
    this.volumeAxisRectLeft.setAttribute('height', `${this.volumeSectionAttributes.height}`);
    this.volumeAxisRectRight.setAttribute('width', `${this.volumeSectionAttributes.margins.right}`);
    this.volumeAxisRectRight.setAttribute('height', `${this.volumeSectionAttributes.height}`);
    // #endregion VOLUME

    this.macdSectionRect.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.macdSectionRect.setAttribute('height', `${(this.sectionsRect.height.baseVal.value * this.chart_attributes.sections[2]) - this.adjSpacer}`);
    this.macdSectionAttributes.width = this.macdSectionRect.getBBox().width;
    this.macdSectionAttributes.height = this.macdSectionRect.getBBox().height;
    this.macdContentRect.setAttribute('width',
      `${this.macdSectionAttributes.width - this.macdSectionAttributes.margins.left - this.macdSectionAttributes.margins.right}`);
    this.macdContentRect.setAttribute('height', `${this.macdSectionAttributes.height}`);
    this.macdAxisRectLeft.setAttribute('width', `${this.macdSectionAttributes.margins.right}`);
    this.macdAxisRectLeft.setAttribute('height', `${this.macdSectionAttributes.height}`);
    this.macdAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.macdAxisRectRight.setAttribute('width', `${this.macdSectionAttributes.margins.right}`);
    this.macdAxisRectRight.setAttribute('height', `${this.macdSectionAttributes.height}`);
    this.macdAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');

    this.rsiSectionRect.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.rsiSectionRect.setAttribute('height', `${(this.sectionsRect.height.baseVal.value * this.chart_attributes.sections[3]) - this.adjSpacer}`);

    // SECTION C
    let bboxC = this.rsiSectionRect.getBBox();
    this.sectAttr_C.width = bboxC.width;
    this.sectAttr_C.height = bboxC.height;

    //BODY
    this.sectionContentCRect.setAttribute('width', `${this.sectAttr_C.width - this.sectAttr_C.margins.left - this.sectAttr_C.margins.right}`);
    this.sectionContentCRect.setAttribute('height', `${this.sectAttr_C.height-this.spacer}`);
    console.log('sectionContentARect', this.ohlcSectionContentRect);

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

    this.ohlcSection.setAttribute('transform', `translate(0,${this.spacer})`);
    this.ohlcSectionContent.setAttribute('transform', `translate(${this.ohlcSectionAttributes.margins.left},0)`);

    this.ohlcAxisLeft.setAttribute('transform', `translate(40,0)`);
    this.ohlc_yAxisR_grp.setAttribute('transform', `translate(${this.ohlcSectionAttributes.width - this.ohlcSectionAttributes.margins.right},${this.ohlcSectionAttributes.margins.top})`);

    this.volumeSection.setAttribute('transform', `translate(0,${this.ohlcSectionAttributes.height + this.spacer + this.spacer})`);
    this.volumeContent.setAttribute('transform', `translate(${this.volumeSectionAttributes.margins.left},0)`);
    this.volume_yAxisL.setAttribute('transform', `translate(${this.volumeSectionAttributes.margins.left},0)`);
    this.volume_yAxisR_grp.setAttribute('transform', `translate(${this.volumeSectionAttributes.width - this.volumeSectionAttributes.margins.right})`);

    this.macdSection.setAttribute('transform',
      `translate(0,${this.sectionsRect.height.baseVal.value * (this.chart_attributes.sections[0] + this.chart_attributes.sections[1]) })`);
    this.macdContent.setAttribute('transform', `translate(${this.macdSectionAttributes.margins.left},0)`);
    this.macdAxisLeft.setAttribute('transform', `translate(${this.macdSectionAttributes.margins.left},0)`);
    this.macdAxisGroupRight.setAttribute('transform',
      `translate(${this.macdSectionAttributes.width - this.macdSectionAttributes.margins.right},${this.macdSectionAttributes.margins.top})`);


    this.yAxisRightGroupC.setAttribute('transform', `translate(${this.sectAttr_C.width - this.sectAttr_C.margins.right},${this.sectAttr_C.margins.top})`);

 
    this.yAxisLeftC.setAttribute('transform', `translate(${this.sectAttr_C.margins.left},0)`);



    this.sectionC.setAttribute('transform',
      `translate(0,
        ${this.sectionsRect.height.baseVal.value * (this.chart_attributes.sections[0] + this.chart_attributes.sections[1] + this.chart_attributes.sections[2]) + (this.spacer )})`);
    this.sectionContentC.setAttribute('transform', `translate(${this.sectAttr_C.margins.left},0)`);
    // this.sectionC.setAttribute('transform', `translate(32,528.75  )`);

    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);
    // this.macdChart.setAttribute('transform', `translate(32,391.5)`);
  }
}
