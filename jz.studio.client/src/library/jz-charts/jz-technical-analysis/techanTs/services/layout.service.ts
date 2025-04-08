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


  ohlcSection!: SVGGElement;
  ohlcSectionRect!: SVGRectElement;
  ohlcSectionContent!: SVGGElement;
  ohlcSectionContentRect!: SVGRectElement;

  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;


  volumeSection!: SVGGElement;
  volumeSectionRect!: SVGRectElement;
  volumeContent!: SVGGElement;
  volumeContentRect!: SVGRectElement;


  macdSection!: SVGGElement;
  macdContent!: SVGGElement;
  macdContentRect!: SVGRectElement;

  macdChart: any;

  rsiSection!: SVGGElement;
  rsiSectionContent!: SVGGElement;
  rsiSectionContentRect!: SVGRectElement;

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
    this.ohlcSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.ohlcSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[0].pct) - this.adjSpacer}`);
    console.log(this.chart_attributes.sections[0].width - this.chart_attributes.sections[0].margins.left - this.chart_attributes.sections[0].margins.right);
    this.ohlcSectionContentRect.setAttribute('width', `${this.chart_attributes.sections[0].width - this.chart_attributes.sections[0].margins.left - this.chart_attributes.sections[0].margins.right}`);
    this.ohlcSectionContentRect.setAttribute('height', `${this.chart_attributes.sections[0].height}`);
    this.chart_attributes.sections[0].width = this.ohlcSectionRect.getBBox().width;
    this.chart_attributes.sections[0].height = this.ohlcSectionRect.getBBox().height;
    this.ohlcAxisRectLeft.setAttribute('width', `${this.chart_attributes.sections[0].margins.right}`);
    this.ohlcAxisRectLeft.setAttribute('height', `${this.chart_attributes.sections[0].height - this.chart_attributes.sections[0].margins.top}`);
    this.ohlcAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.ohlcAxisRectRight.setAttribute('width', `${this.chart_attributes.sections[0].margins.right}`);
    this.ohlcAxisRectRight.setAttribute('height', `${this.chart_attributes.sections[0].height - this.chart_attributes.sections[0].margins.top}`);
    this.ohlcAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');
    // #endregion OHLC

    // #region VOLUME
    this.volumeSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.volumeSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[1].pct) - this.adjSpacer}`);
    this.chart_attributes.sections[1].width = this.volumeSectionRect.getBBox().width;
    this.chart_attributes.sections[1].height = this.volumeSectionRect.getBBox().height;
    this.volumeAxisRectLeft.setAttribute('width', `${this.chart_attributes.sections[1].margins.left}`);
    this.volumeAxisRectLeft.setAttribute('height', `${this.chart_attributes.sections[1].height}`);
    this.volumeAxisRectRight.setAttribute('width', `${this.chart_attributes.sections[1].margins.right}`);
    this.volumeAxisRectRight.setAttribute('height', `${this.chart_attributes.sections[1].height}`);
    // #endregion VOLUME

    this.macdSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.macdSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[2].pct) - this.adjSpacer}`);
    this.chart_attributes.sections[2].width = this.macdSectionRect.getBBox().width;
    this.chart_attributes.sections[2].height = this.macdSectionRect.getBBox().height;
    this.macdContentRect.setAttribute('width',
      `${this.chart_attributes.sections[2].width - this.chart_attributes.sections[2].margins.left - this.chart_attributes.sections[2].margins.right}`);
    this.macdContentRect.setAttribute('height', `${this.chart_attributes.sections[2].height}`);
    this.macdAxisRectLeft.setAttribute('width', `${this.chart_attributes.sections[2].margins.right}`);
    this.macdAxisRectLeft.setAttribute('height', `${this.chart_attributes.sections[2].height}`);
    this.macdAxisRectLeft.setAttribute('fill', 'var(--plt-clr-2)');
    this.macdAxisRectRight.setAttribute('width', `${this.chart_attributes.sections[2].margins.right}`);
    this.macdAxisRectRight.setAttribute('height', `${this.chart_attributes.sections[2].height}`);
    this.macdAxisRectRight.setAttribute('fill', 'var(--plt-clr-2)');

    this.rsiSectionRect.setAttribute('width', `${this.sectionsContainerRect.width.baseVal.value}`);
    this.rsiSectionRect.setAttribute('height', `${(this.sectionsContainerRect.height.baseVal.value * this.chart_attributes.sections[3].pct) - this.adjSpacer}`);

    // SECTION C
    let bboxC = this.rsiSectionRect.getBBox();
    this.chart_attributes.sections[3].width = bboxC.width;
    this.chart_attributes.sections[3].height = bboxC.height;

    //BODY
    this.rsiSectionContentRect.setAttribute('width', `${this.chart_attributes.sections[3].width - this.chart_attributes.sections[3].margins.left - this.chart_attributes.sections[3].margins.right}`);
    this.rsiSectionContentRect.setAttribute('height', `${this.chart_attributes.sections[3].height-this.spacer}`);
    console.log('rsiSectionontentARect', this.ohlcSectionContentRect);

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
  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.chart_attributes.height - this.chart_attributes.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.sectionsContainer.setAttribute('transform', `translate(0,${this.chart_attributes.xAxisTop})`)

    this.ohlcSection.setAttribute('transform', `translate(0,${this.spacer})`);
    this.ohlcSectionContent.setAttribute('transform', `translate(${this.chart_attributes.sections[0].margins.left},0)`);

    this.ohlcAxisLeft.setAttribute('transform', `translate(40,0)`);
    this.ohlc_yAxisR_grp.setAttribute('transform', `translate(${this.chart_attributes.sections[0].width - this.chart_attributes.sections[0].margins.right},${this.chart_attributes.sections[0].margins.top})`);

    this.volumeSection.setAttribute('transform', `translate(0,${this.chart_attributes.sections[0].height + this.spacer + this.spacer})`);
    this.volumeContent.setAttribute('transform', `translate(${this.chart_attributes.sections[1].margins.left},0)`);
    this.volume_yAxisL.setAttribute('transform', `translate(${this.chart_attributes.sections[1].margins.left},0)`);
    this.volume_yAxisR_grp.setAttribute('transform', `translate(${this.chart_attributes.sections[1].width - this.chart_attributes.sections[1].margins.right})`);

    this.macdSection.setAttribute('transform',
      `translate(0,${(this.chart_attributes.sections[0].height + this.chart_attributes.sections[1].height + (this.spacer*3))})`);
    this.macdContent.setAttribute('transform', `translate(${this.chart_attributes.sections[2].margins.left},0)`);
    this.macdAxisLeft.setAttribute('transform', `translate(${this.chart_attributes.sections[2].margins.left},0)`);
    this.macdAxisGroupRight.setAttribute('transform',
      `translate(${this.chart_attributes.sections[2].width - this.chart_attributes.sections[2].margins.right},${this.chart_attributes.sections[2].margins.top})`);


    this.yAxisRightGroupC.setAttribute('transform', `translate(${this.chart_attributes.sections[3].width - this.chart_attributes.sections[3].margins.right},${this.chart_attributes.sections[3].margins.top})`);

 
    this.yAxisLeftC.setAttribute('transform', `translate(${this.chart_attributes.sections[3].margins.left},0)`);



    this.rsiSection.setAttribute('transform',
      `translate(0,
        ${ (this.chart_attributes.sections[0].height + this.chart_attributes.sections[1].height + this.chart_attributes.sections[2].height) + (this.spacer*4)})`);
    this.rsiSectionContent.setAttribute('transform', `translate(${this.chart_attributes.sections[3].margins.left},0)`);
    // this.rsiSection.setAttribute('transform', `translate(32,528.75  )`);

    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);
    // this.macdChart.setAttribute('transform', `translate(32,391.5)`);
  }
}
