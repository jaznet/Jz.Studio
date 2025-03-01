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

  chart_attributes: chart_attributes = { width: 0, height: 0, margin: 8, xAxisTop: 32, xAxisBottom: 32 };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };
  sectionAattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 32, bottom: 0, left: 32 } };

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
  sectionBattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 32, bottom: 0, left: 32 } };
  macdChart: any;

  sectionC!: SVGGElement;
  sectionCattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 32, bottom: 0, left: 32 } };
  rsiGroup: any;

  sectionRectA!: SVGRectElement;
  sectionRectB!: SVGRectElement;
  sectionRectC!: SVGRectElement;

  xAxisTop!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  yAxisLeftA!: SVGGElement;
  yAxisLeftGroupA!: SVGGElement;
  yAxisLeftRectA!: SVGRectElement;

  yAxisRightA!: SVGGElement;
  yAxisRightGroupA!: SVGGElement;
  yAxisRightRectA!: SVGRectElement;

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

  rectVolume!: SVGRectElement;

  constructor() { }

  createScaffolding() {
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  sizeSections(): void {
    this.chart_attributes.width = this.svgContainer.clientWidth ;
    this.chart_attributes.height = this.svgContainer.clientHeight - (this.chart_attributes.margin * 2) ;

    // SVG
    let svgBRect: SVGRect = this.svgContainer.getBoundingClientRect();
    this.svg_attributes.height = svgBRect.height - (this.chart_attributes.margin * 2);
    this.svg_attributes.width = svgBRect.width;
    this.svgElement.nativeElement.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElement.nativeElement.setAttribute('width', `${this.chart_attributes.width}`);
    this.svgElementRect.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElementRect.setAttribute('width', `${this.chart_attributes.width}`);

    // X-AXIS TOP
    this.xAxisTop.setAttribute('id', 'TopA');
    this.xAxisTopRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.xAxisTopRect.setAttribute('height', `${this.chart_attributes.xAxisTop}`);

    // X AXIS BOTTOM
    this.xAxisBottomGroup.setAttribute('id', 'xAxisBottom');
    this.xAxisBottomRect.setAttribute('width', `${this.sectionAattributes.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.sectionAattributes.margins.bottom}`);
    //this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

    // SECTIONS
    this.sectionsRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.sectionsRect.setAttribute('height', `${this.chart_attributes.height - this.chart_attributes.xAxisTop - this.chart_attributes.xAxisBottom}`);
    this.sectionsRect.setAttribute('stroke', 'white');

    console.log('sections', this.sectionsRect);
    this.sectionRectA.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectA.setAttribute('height', `${this.sectionsRect.height.baseVal.value * .5}`);
    this.sectionRectB.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectB.setAttribute('height', `${this.sectionsRect.height.baseVal.value * .25}`);
    this.sectionRectC.setAttribute('width', `${this.sectionsRect.width.baseVal.value}`);
    this.sectionRectC.setAttribute('height', `${this.sectionsRect.height.baseVal.value * .25}`);

    // SECTION A
    let bboxA = this.sectionRectA.getBBox();
    this.sectionAattributes.width = bboxA.width;
    this.sectionAattributes.height = bboxA.height;

    // SECTION B
    let bboxB = this.sectionRectB.getBBox();
    this.sectionBattributes.width = bboxB.width;
    this.sectionBattributes.height = bboxB.height;
    console.log(this.sectionAattributes.height);

    // SECTION C
    let bboxC = this.sectionRectC.getBBox();
    this.sectionCattributes.width = bboxC.width - this.sectionCattributes.margins.left - this.sectionCattributes.margins.right;
    this.sectionCattributes.height = bboxC.height;

    //BODY
    this.sectionContentARect.setAttribute('width', `${this.sectionAattributes.width - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right}`);
    this.sectionContentARect.setAttribute('height', `${this.sectionAattributes.height}`);
    console.log('sectionContentARect', this.sectionContentARect);
    this.ohlcRect.setAttribute('width', (this.sectionContentARect.width.baseVal.valueAsString));
    this.ohlcRect.setAttribute('height', ((this.sectionContentARect.height.baseVal.value)).toString());
    this.ohlcRect.setAttribute('fill', 'var(--plt-chart-1)');
    this.rectVolume.setAttribute('width', (this.sectionContentARect.width.baseVal.value.toString() ));
    console.log('volume', this.ohlcRect.height);
    this.rectVolume.setAttribute('height', (this.sectionAattributes.height * .2).toString());
    //  this.ohlcRect.setAttribute('width', this.svgWidth.toString());

    console.log('sectionContentA', this.rectVolume.getBBox().height);

    /* LEFT A */
    this.yAxisLeftRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisLeftRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top}`);
    this.yAxisLeftRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisLeftA.setAttribute('id', 'LeftA');

/*  RIGHT A */
    this.yAxisRightRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

    /* LEFT  B*/
    this.yAxisLeftRectB.setAttribute('width', `${this.sectionBattributes.margins.right}`);
    this.yAxisLeftRectB.setAttribute('height', `${this.sectionBattributes.height}`);
    this.yAxisLeftRectB.setAttribute('fill', 'var(--plt-clr-2)');
    console.log('left axis', this.yAxisLeftRectB);

    /*  RIGHT B */
    this.yAxisRightRectB.setAttribute('width', `${this.sectionBattributes.margins.right}`);
    this.yAxisRightRectB.setAttribute('height', `${this.sectionBattributes.height}`);
    this.yAxisRightRectB.setAttribute('fill', 'var(--plt-clr-2)');
    console.log('right axis', this.yAxisRightRectB);

    /* LEFT  B*/
    this.yAxisLeftRectC.setAttribute('width', `${this.sectionCattributes.margins.right}`);
    this.yAxisLeftRectC.setAttribute('height', `${this.sectionCattributes.height}`);
    this.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');
    console.log('left axis', this.yAxisLeftRectC);

    /*  RIGHT B */
    this.yAxisRightRectC.setAttribute('width', `${this.sectionCattributes.margins.right}`);
    this.yAxisRightRectC.setAttribute('height', `${this.sectionCattributes.height}`);
    this.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');
    console.log('right axis', this.yAxisRightRectC);

    /* LEFT  C*/
    this.yAxisLeftRectC.setAttribute('width', `${this.sectionCattributes.margins.right}`);
    this.yAxisLeftRectC.setAttribute('height', `${this.sectionCattributes.height}`);
    this.yAxisLeftRectC.setAttribute('fill', 'var(--plt-clr-2)');
    console.log('left axis', this.yAxisLeftRectC);

    /*  RIGHT C */
    this.yAxisRightRectC.setAttribute('width', `${this.sectionCattributes.margins.right}`);
    this.yAxisRightRectC.setAttribute('height', `${this.sectionCattributes.height}`);
    this.yAxisRightRectC.setAttribute('fill', 'var(--plt-clr-2)');
    console.log('right axis', this.yAxisRightRectC);

  }



  alignChartsToScaffold(): void {
    this.sections.setAttribute('transform', `translate(0,${this.chart_attributes.xAxisTop})`)
    this.sectionA.setAttribute('transform', `translate(0,0)`);
    this.sectionB.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * .5})`);
    this.sectionC.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * .75})`);
   // this.sectionC.setAttribute('transform', `translate(32,528.75  )`);
    this.sectionContentA.setAttribute('transform', `translate(32,0)`);
    this.yAxisRightGroupA.setAttribute('transform', `translate(${this.sectionAattributes.width - this.sectionAattributes.margins.right},${this.sectionAattributes.margins.top})`);
    this.yAxisRightGroupB.setAttribute('transform', `translate(${this.sectionBattributes.width - this.sectionBattributes.margins.right},${this.sectionBattributes.margins.top})`);
    this.yAxisRightGroupC.setAttribute('transform', `translate(${this.sectionCattributes.width - this.sectionCattributes.margins.right},${this.sectionCattributes.margins.top})`);
    this.sectionAvolume.setAttribute('transform', `translate(0,${this.sectionContentARect.getBBox().height - this.rectVolume.getBBox().height})`);
    this.xAxisTop.setAttribute('transform', `translate(32,32)`);
   this.xAxisBottomGroup.setAttribute('transform', `translate(0, ${this.chart_attributes.height - this.chart_attributes.xAxisTop })`);
    //this.xAxisTopA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
   

    //this.yAxisLeftGroupA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
    //this.yAxisLeftA.setAttribute('transform', `translate(${this.sectionAattributes.margins.left},0)`);


    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);

   // this.macdChart.setAttribute('transform', `translate(32,391.5)`);

  }
}
