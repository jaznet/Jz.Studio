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
  sectionsRect!: any;

  sectionA!: SVGGElement;
  sectionAcontent!: SVGGElement;
  sectionAcontentRect!: SVGRectElement;
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

  rectA!: SVGRectElement;
  rectB!: SVGRectElement;
  rectC!: SVGRectElement;

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
    this.chart_attributes.height = this.svgContainer.clientHeight - (this.chart_attributes.margin * 2);
   
    let svgBRect: SVGRect = this.svgContainer.getBoundingClientRect();
    this.svg_attributes.height = svgBRect.height - (this.chart_attributes.margin * 2);
    this.svg_attributes.width = svgBRect.width;
    console.log('SVG Attributes', this.svg_attributes);

    this.svgElement.nativeElement.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElement.nativeElement.setAttribute('width', `${this.chart_attributes.width}`);
    this.svgElementRect.setAttribute('height', `${this.chart_attributes.height}`);
    this.svgElementRect.setAttribute('width', `${this.chart_attributes.width}`);

    // SECTION A
      let bboxA = this.rectA.getBBox();
    this.sectionAattributes.width = bboxA.width;
    this.sectionAattributes.height = bboxA.height; 
    // X-AXIS TOP
    this.xAxisTop.setAttribute('id', 'TopA');
    this.xAxisTopRect.setAttribute('width', `${this.chart_attributes.width}`);
    this.xAxisTopRect.setAttribute('height', `${this.chart_attributes.xAxisTop}`);
    this.xAxisTopRect.setAttribute('fill', '#0B3954');
    //BODY
    this.ohlcRect.setAttribute('width', (this.svg_attributes.width.toString()));
    this.ohlcRect.setAttribute('height', ((this.svg_attributes.height * .5)).toString());
    this.rectVolume.setAttribute('width', (this.svg_attributes.width.toString() ));
    console.log('volume', this.ohlcRect.height);
    this.rectVolume.setAttribute('height', (this.sectionAattributes.height * .2).toString());
    //  this.ohlcRect.setAttribute('width', this.svgWidth.toString());
    this.sectionAcontentRect.setAttribute('width', `${this.sectionAattributes.width-this.sectionAattributes.margins.left-this.sectionAattributes.margins.right}`);
    this.sectionAcontentRect.setAttribute('height', `${this.sectionAattributes.height}`);

    console.log('sectionAcontent', this.rectVolume.getBBox().height);
    // RIGHT
/*    this.yAxisRightA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);*/

    this.yAxisRightRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

    // X AXIS BOTTOM
    this.xAxisBottomGroup.setAttribute('id', 'xAxisBottom');
    this.xAxisBottomRect.setAttribute('width', `${this.sectionAattributes.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.sectionAattributes.margins.bottom}`);
    this.xAxisBottomRect.setAttribute('fill', 'brown');

    // LEFT
    this.yAxisLeftRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisLeftRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisLeftRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisLeftA.setAttribute('id', 'LeftA');


/*    this.candlestick.gCandlestick.setAttribute('transform', `translate(${this.sectionA.margins.left, this.sectionA.margins.right})`);*/

    // SECTION A-1


    // SECTION B
    let bboxB = this.rectB.getBBox();
    this.sectionBattributes.width = bboxB.width;
    this.sectionBattributes.height = bboxB.height;
    console.log(this.sectionAattributes.height);

    // SECTION C
    let bboxC = this.rectC.getBBox();
    this.sectionCattributes.width = bboxC.width;
    this.sectionCattributes.height = bboxC.height;

  }

  alignChartsToScaffold(): void {
    this.sections.setAttribute('transform', 'translate(0,0)')
    this.sectionA.setAttribute('transform', `translate(0,0)`);
    this.sectionB.setAttribute('transform', `translate(0,${this.chart_attributes.height*.5})`);
    this.sectionC.setAttribute('transform', `translate(32,528.75  )`);
    //this.sectionAcontent.setAttribute('transform', `translate(32,32)`);
    //this.sectionAvolume.setAttribute('transform', `translate(0,${this.sectionAcontentRect.getBBox().height - this.rectVolume.getBBox().height})`);
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
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
