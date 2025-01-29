import { Injectable } from '@angular/core';
import { ChartAttributes, SectionAttributes } from '../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChartLayoutService {

  svg!: any;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: SVGRectElement;
  svgRectWidth = 0;
  svgRectHeight = 0;

  chartAttributes: ChartAttributes = {width:0, height:0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft:32,yAxisRight:32 };
  sectionAattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 32, bottom: 32, left: 32 } };

  sectionA!: SVGGElement;
  sectionAcontent!: SVGGElement;
  sectionAcontentRect!: SVGRectElement;
  sectionAvolume!: SVGGElement;
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

  xAxisTopA!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRectA!: SVGRectElement;

  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  yAxisRightA!: SVGGElement;
  yAxisRightGroupA!: SVGGElement;
  yAxisRightRectA!: SVGRectElement;



  yAxisLeftA!: SVGGElement;
  yAxisLeftGroupA!: SVGGElement;
  yAxisLeftRectA!: SVGRectElement;

  rectCandlestick!: SVGRectElement;
  rectVolume!: SVGRectElement;

  constructor() { }

  createScaffolding() {
    this.createSections();
    this.alignChartsToScaffold();
  }

  createSections(): void {
    // SECTION A
    let bboxA = this.rectA.getBBox();
    this.sectionAattributes.width = bboxA.width;
    this.sectionAattributes.height = bboxA.height;
    //BODY
    this.rectCandlestick.setAttribute('width', (this.svgWidth - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right).toString());
    this.rectCandlestick.setAttribute('height', ((this.svgHeight * .5) - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom).toString());
    this.rectVolume.setAttribute('width', (this.svgWidth - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right).toString());
    console.log('volume', this.rectCandlestick.height);
    this.rectVolume.setAttribute('height', (this.sectionAattributes.height * .2).toString());
    //  this.rectCandlestick.setAttribute('width', this.svgWidth.toString());
    this.sectionAcontentRect.setAttribute('width', `${this.sectionAattributes.width-this.sectionAattributes.margins.left-this.sectionAattributes.margins.right}`);
    this.sectionAcontentRect.setAttribute('height', `${this.sectionAattributes.height-this.sectionAattributes.margins.top-this.sectionAattributes.margins.bottom}`);

    console.log('sectionAcontent', this.rectVolume.getBBox().height);


    // TOP

    this.xAxisTopRectA.setAttribute('width', `${this.sectionAattributes.width - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right}`);
    this.xAxisTopRectA.setAttribute('height', `${this.sectionAattributes.margins.top}`);
    this.xAxisTopRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.xAxisTopA.setAttribute('id', 'TopA');


    // RIGHT
/*    this.yAxisRightA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);*/

    this.yAxisRightRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

    // X AXIS BOTTOM
    this.xAxisBottomGroup.setAttribute('id', 'BottomA');
    this.xAxisBottomRect.setAttribute('width', `${this.sectionAattributes.width - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right}`);
    this.xAxisBottomRect.setAttribute('height', `${this.sectionAattributes.margins.bottom}`);
    this.xAxisBottomRect.setAttribute('fill', 'var(--plt-clr-2)');

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
    this.sectionA.setAttribute('transform', `translate(32,32)`);
    this.sectionB.setAttribute('transform', `translate(32,400)`);
    this.sectionC.setAttribute('transform', `translate(32,600)`);
    //this.sectionAcontent.setAttribute('transform', `translate(32,32)`);
    //this.sectionAvolume.setAttribute('transform', `translate(0,${this.sectionAcontentRect.getBBox().height - this.rectVolume.getBBox().height})`);
    this.xAxisTopGroup.setAttribute('transform', `translate(${this.chartAttributes.yAxisLeft},${this.chartAttributes.xAxisTop})`);
    this.xAxisBottomGroup.setAttribute('transform', `translate(${this.chartAttributes.yAxisLeft}, ${this.chartAttributes.height - this.chartAttributes.xAxisBottom})`);
    //this.xAxisTopA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
    //this.yAxisRightGroupA.setAttribute('transform', `translate(${this.sectionAattributes.width - this.sectionAattributes.margins.right},${this.sectionAattributes.margins.top})`);

    //this.yAxisLeftGroupA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
    //this.yAxisLeftA.setAttribute('transform', `translate(${this.sectionAattributes.margins.left},0)`);


    //this.macdChart.setAttribute('transform', `translate(32,391.5)`);
    //this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);

   // this.macdChart.setAttribute('transform', `translate(32,391.5)`);

  }
}
