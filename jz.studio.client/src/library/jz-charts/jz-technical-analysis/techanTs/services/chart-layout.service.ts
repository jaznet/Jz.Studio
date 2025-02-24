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
  sectionAattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 32, bottom: 32, left: 32 } };

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
  sectionBattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };
  macdChart: any;

  sectionC!: SVGGElement;
  sectionCattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };
  rsiGroup: any;

  sectionRectA!: SVGRectElement;
  sectionRectB!: SVGRectElement;
  sectionRectC!: SVGRectElement;

  xAxisTop!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  yAxisRightA!: SVGGElement;
  yAxisRightGroupA!: SVGGElement;
  yAxisRightRectA!: SVGRectElement;

  yAxisLeftA!: SVGGElement;
  yAxisLeftGroupA!: SVGGElement;
  yAxisLeftRectA!: SVGRectElement;

  rectVolume!: SVGRectElement;

  constructor() { }

  createScaffolding() {
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  sizeSections(): void {
    console.log('Chart Attributes', this.chart_attributes);

 //   this.chart_attributes.width = this.svgElement.clientWidth - (this.chart_attributes.margin * 2);
    this.chart_attributes.width = this.svgContainer.clientWidth ;
    this.chart_attributes.height = this.svgContainer.clientHeight - (this.chart_attributes.margin * 2) ;
   
    let svgBRect: SVGRect = this.svgContainer.getBoundingClientRect();
    this.svg_attributes.height = svgBRect.height - (this.chart_attributes.margin * 2);
    this.svg_attributes.width = svgBRect.width;
    console.log('SVG Attributes', this.svg_attributes);

    this.svgElement.nativeElement.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElement.nativeElement.setAttribute('width', `${this.chart_attributes.width}`);
    this.svgElementRect.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElementRect.setAttribute('width', `${this.chart_attributes.width}`);

    // X-AXIS TOP
    this.xAxisTop.setAttribute('id', 'TopA');
    this.xAxisTopRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.xAxisTopRect.setAttribute('height', `${this.chart_attributes.xAxisTop}`);
    this.xAxisTopRect.setAttribute('fill', 'var(--plt-chart-2');

    // X AXIS BOTTOM
    this.xAxisBottomGroup.setAttribute('id', 'xAxisBottom');
    this.xAxisBottomRect.setAttribute('width', `${this.sectionAattributes.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.sectionAattributes.margins.bottom}`);
    this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

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
    this.sectionBattributes.height = bboxB.height-16;
    console.log(this.sectionAattributes.height);

    // SECTION C
    let bboxC = this.sectionRectC.getBBox();
    this.sectionCattributes.width = bboxC.width;
    this.sectionCattributes.height = bboxC.height;

    //BODY
    this.sectionContentARect.setAttribute('width', `${this.sectionAattributes.width - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right}`);
    this.sectionContentARect.setAttribute('height', `${this.sectionAattributes.height}`);
    console.log('sectionContentARect', this.sectionContentARect);
    this.ohlcRect.setAttribute('width', (this.sectionContentARect.width.baseVal.valueAsString));
    this.ohlcRect.setAttribute('height', ((this.sectionContentARect.height.baseVal.value * .5)).toString());
    this.rectVolume.setAttribute('width', (this.sectionContentARect.width.baseVal.value.toString() ));
    console.log('volume', this.ohlcRect.height);
    this.rectVolume.setAttribute('height', (this.sectionAattributes.height * .2).toString());
    //  this.ohlcRect.setAttribute('width', this.svgWidth.toString());

    console.log('sectionContentA', this.rectVolume.getBBox().height);

    // RIGHT
/*    this.yAxisRightA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);*/
    this.yAxisRightRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

    // LEFT
    this.yAxisLeftRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisLeftRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisLeftRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisLeftA.setAttribute('id', 'LeftA');
  }

  alignChartsToScaffold(): void {
    this.sections.setAttribute('transform', `translate(0,${this.chart_attributes.xAxisTop})`)
    this.sectionA.setAttribute('transform', `translate(0,0)`);
    this.sectionB.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * .5})`);
    this.sectionC.setAttribute('transform', `translate(0,${this.sectionsRect.height.baseVal.value * .75})`);
   // this.sectionC.setAttribute('transform', `translate(32,528.75  )`);
    this.sectionContentA.setAttribute('transform', `translate(32,0)`);
    this.sectionAvolume.setAttribute('transform', `translate(0,${this.sectionContentARect.getBBox().height - this.rectVolume.getBBox().height})`);
    this.xAxisTop.setAttribute('transform', `translate(32,32)`);
   this.xAxisBottomGroup.setAttribute('transform', `translate(0, ${this.chart_attributes.height - this.chart_attributes.xAxisTop })`);
    //this.xAxisTopA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
    //this.yAxisRightGroupA.setAttribute('transform', `translate(${this.sectionAattributes.width - this.sectionAattributes.margins.right},${this.sectionAattributes.margins.top})`);

    //this.yAxisLeftGroupA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
    //this.yAxisLeftA.setAttribute('transform', `translate(${this.sectionAattributes.margins.left},0)`);


    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);

   // this.macdChart.setAttribute('transform', `translate(32,391.5)`);

  }
}
