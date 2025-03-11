import { ElementRef, Injectable } from '@angular/core'; 
import { chart_attributes, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChartLayoutService {

  svgContainer: any;
  svgElement!: ElementRef<any>;
  //svgWidth = 0;
  //svgHeight = 0;
  svgElementRect!: SVGRectElement;
  //svgRectWidth = 0;
  //svgRectHeight = 0;

  chart_attributes: chart_attributes = { width: 0, height: 0,  xAxisTop: 32, xAxisBottom: 32, yAxisLeft:40,yAxisRight:40 };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };
  sectAttr_A: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };

  sections!: SVGGElement;
  sectionsRect!: SVGRectElement;

  sectionA!: SVGGElement;
  sectionContentA!: SVGGElement;
  sectionContentARect!: SVGRectElement;
  sectionAvolume!: SVGGElement;

  ohlcRect!: SVGRectElement;
  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;

  sectionB!: SVGGElement;
  sectionContentB!: SVGGElement;
  sectionContentBRect!: SVGRectElement;
  sectAttr_B: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  macdChart: any;

  sectionC!: SVGGElement;
  sectionContentC!: SVGGElement;
  sectionContentCRect!: SVGRectElement;
  sectAttr_C: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 40, bottom: 0, left: 40 } };
  rsiGroup: any;

  sectionRectA!: SVGRectElement;
  sectionRectB!: SVGRectElement;
  sectionRectC!: SVGRectElement;

  // #region Axes
  xAxisMonths!: SVGGElement;
  xAxisDays!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottom!: SVGGElement;
  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  yAxisLeftA!: SVGGElement;
  yAxisLeftGroupA!: SVGGElement;
  yAxisLeftRectA!: SVGRectElement;

  yAxisRightA!: SVGGElement;
  yAxisRightGroupA!: SVGGElement;
  yAxisRightRectA!: SVGRectElement;

  yAxisVolLeftA!: SVGGElement;
  yAxisVolLeftGroupA!: SVGGElement;
  yAxisVolLeftRectA!: SVGRectElement;

  yAxisVolRightA!: SVGGElement;
  yAxisVolRightGroupA!: SVGGElement;
  yAxisVolRightRectA!: SVGRectElement;

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

  constructor() { }

  createScaffolding() {
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  sizeSections(): void {
    this.chart_attributes.width = this.svgContainer.clientWidth ;
    this.chart_attributes.height = this.svgContainer.clientHeight - this.chart_attributes.yAxisLeft -  this.chart_attributes.yAxisRight ;

    // SVG
    let svgBRect: SVGRect = this.svgContainer.getBoundingClientRect();
    this.svg_attributes.height = svgBRect.height - this.chart_attributes.yAxisLeft - this.chart_attributes.yAxisRight;
    this.svg_attributes.width = svgBRect.width;
    this.svgElement.nativeElement.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElement.nativeElement.setAttribute('width', `${this.chart_attributes.width}`);
    this.svgElementRect.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElementRect.setAttribute('width', `${this.chart_attributes.width}`);

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

   // console.log('sections', this.sectionsRect);
    this.sectionRectA.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectA.setAttribute('height', `${this.sectionsRect.height.baseVal.value * .5}`);
    this.sectionRectB.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectB.setAttribute('height', `${this.sectionsRect.height.baseVal.value * .25}`);
    this.sectionRectC.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectC.setAttribute('height', `${this.sectionsRect.height.baseVal.value * .25}`);

    // SECTION A
    let bboxA = this.sectionRectA.getBBox();
    this.sectAttr_A.width = bboxA.width;
    this.sectAttr_A.height = bboxA.height;

    // SECTION B
    let bboxB = this.sectionRectB.getBBox();
    this.sectAttr_B.width = bboxB.width;
    this.sectAttr_B.height = bboxB.height;
    console.log(this.sectAttr_A.height);

    // SECTION C
    let bboxC = this.sectionRectC.getBBox();
    this.sectAttr_C.width = bboxC.width;
    this.sectAttr_C.height = bboxC.height;

    //BODY
    this.sectionContentARect.setAttribute('width', `${this.sectAttr_A.width - this.sectAttr_A.margins.left - this.sectAttr_A.margins.right}`);
    this.sectionContentARect.setAttribute('height', `${this.sectAttr_A.height}`);
    this.sectionContentBRect.setAttribute('width', `${this.sectAttr_B.width - this.sectAttr_B.margins.left - this.sectAttr_B.margins.right}`);
    this.sectionContentBRect.setAttribute('height', `${this.sectAttr_B.height}`);
    this.sectionContentCRect.setAttribute('width', `${this.sectAttr_C.width - this.sectAttr_C.margins.left - this.sectAttr_C.margins.right}`);
    this.sectionContentCRect.setAttribute('height', `${this.sectAttr_C.height}`);
    console.log('sectionContentARect', this.sectionContentARect);


    this.ohlcRect.setAttribute('width', (this.sectionContentARect.width.baseVal.valueAsString));
    this.ohlcRect.setAttribute('height', ((this.sectionContentARect.height.baseVal.value * .75)).toString());
    this.ohlcRect.setAttribute('fill', 'var(--plt-chart-1)');
    this.rectVolume.setAttribute('width', (this.sectionContentARect.width.baseVal.value.toString() ));
    console.log('volume', this.ohlcRect.height);
    this.rectVolume.setAttribute('height', (this.sectAttr_A.height * .2).toString());
    //  this.ohlcRect.setAttribute('width', this.svgWidth.toString());

    console.log('sectionContentA', this.rectVolume.getBBox().height);

    /* LEFT A */
    this.yAxisLeftRectA.setAttribute('width', `${this.sectAttr_A.margins.right}`);
    this.yAxisLeftRectA.setAttribute('height', `${this.sectAttr_A.height - this.sectAttr_A.margins.top}`);
    this.yAxisLeftRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisLeftA.setAttribute('id', 'LeftA');

/*  RIGHT A */
    this.yAxisRightRectA.setAttribute('width', `${this.sectAttr_A.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${this.sectAttr_A.height - this.sectAttr_A.margins.top}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

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
    this.xAxisMonths.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.chart_attributes.height})`);
    this.xAxisBottom.setAttribute('transform', `translate(40,-32)`);

    this.sections.setAttribute('transform', `translate(0,${this.chart_attributes.xAxisTop})`)

    this.sectionA.setAttribute('transform', `translate(0,0)`);
    this.sectionContentA.setAttribute('transform', `translate(${this.sectAttr_A.margins.left},0)`);

    this.sectionB.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * .5})`);
    this.sectionContentB.setAttribute('transform', `translate(${this.sectAttr_B.margins.left},0)`);

    this.sectionC.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * .75})`);
    this.sectionContentC.setAttribute('transform', `translate(${this.sectAttr_C.margins.left},0)`);
   // this.sectionC.setAttribute('transform', `translate(32,528.75  )`);


   
    this.yAxisRightGroupA.setAttribute('transform', `translate(${this.sectAttr_A.width - this.sectAttr_A.margins.right},${this.sectAttr_A.margins.top})`);
    this.yAxisRightGroupB.setAttribute('transform', `translate(${this.sectAttr_B.width - this.sectAttr_B.margins.right},${this.sectAttr_B.margins.top})`);
    this.yAxisRightGroupC.setAttribute('transform', `translate(${this.sectAttr_C.width - this.sectAttr_C.margins.right},${this.sectAttr_C.margins.top})`);
    this.sectionAvolume.setAttribute('transform', `translate(0,${this.sectionContentARect.getBBox().height - this.rectVolume.getBBox().height})`);

  //this.xAxisBottom.setAttribute('transform', `translate(0, ${this.chart_attributes.height - this.chart_attributes.xAxisTop })`);
    //this.xAxisTopA.setAttribute('transform', `translate(0,${this.sectAttr_A.margins.top})`);
    //this.yAxisLeftGroupA.setAttribute('transform', `translate(0,${this.sectAttr_A.margins.top})`);
    this.yAxisLeftA.setAttribute('transform', `translate(${this.sectAttr_A.margins.left},0)`);
    this.yAxisLeftB.setAttribute('transform', `translate(${this.sectAttr_B.margins.left},0)`);
    this.yAxisLeftC.setAttribute('transform', `translate(${this.sectAttr_C.margins.left},0)`);
    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);
   // this.macdChart.setAttribute('transform', `translate(32,391.5)`);
  }
}
