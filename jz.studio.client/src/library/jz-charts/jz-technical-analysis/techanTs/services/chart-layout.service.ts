import { Injectable } from '@angular/core';
import { SectionAttributes } from '../interfaces/techan-interfaces';

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

  sectionAattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 0, right: 32, bottom: 32, left: 32 } };

  sectionA!: SVGGElement;
  sectionAcontent!: SVGGElement;
  sectionAcontentRect!: SVGRectElement;
  sectionAvolume!: SVGGElement;
  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;

  sectionBattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };
  macdChart: any;

  sectionCattributes: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };
  rsiGroup: any;

  rectA!: SVGRectElement;
  rectB!: SVGRectElement;
  rectC!: SVGRectElement;

  xAxisTopA!: SVGGElement;
  xAxisTopGroupA!: SVGGElement;
  xAxisTopRectA!: SVGRectElement;

  yAxisRightA!: SVGGElement;
  yAxisRightGroupA!: SVGGElement;
  yAxisRightRectA!: SVGRectElement;

  xAxisBottomA!: SVGGElement;
  xAxisBottomRectA!: SVGRectElement;

  yAxisLeftA!: SVGGElement;
  yAxisLeftGroupA!: SVGGElement;
  yAxisLeftRectA!: SVGRectElement;

  rectCandlestick!: SVGRectElement;
  rectVolume!: SVGRectElement;

  constructor() { }

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
    this.sectionAcontent.setAttribute('transform', `translate(32,32)`);
    console.log('sectionAcontent', this.rectVolume.getBBox().height);
    this.sectionAvolume.setAttribute('transform', `translate(0,${this.sectionAcontentRect.getBBox().height - this.rectVolume.getBBox().height})`);

    // TOP
    this.xAxisTopGroupA.setAttribute('transform', `translate(${this.sectionAattributes.margins.left},0)`);
    this.xAxisTopRectA.setAttribute('width', `${this.sectionAattributes.width - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right}`);
    this.xAxisTopRectA.setAttribute('height', `${this.sectionAattributes.margins.top}`);
    this.xAxisTopRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.xAxisTopA.setAttribute('id', 'TopA');
    this.xAxisTopA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);

    // RIGHT
/*    this.yAxisRightA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);*/
    this.yAxisRightGroupA.setAttribute('transform', `translate(${this.sectionAattributes.width - this.sectionAattributes.margins.right},${this.sectionAattributes.margins.top})`);
    this.yAxisRightRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

    // BOTTOM
    this.xAxisBottomA.setAttribute('id', 'BottomA');
    this.xAxisBottomA.setAttribute('transform', `translate(${this.sectionAattributes.margins.left}, ${this.sectionAattributes.height - this.sectionAattributes.margins.bottom})`);
    this.xAxisBottomRectA.setAttribute('width', `${this.sectionAattributes.width - this.sectionAattributes.margins.left - this.sectionAattributes.margins.right}`);
    this.xAxisBottomRectA.setAttribute('height', `${this.sectionAattributes.margins.bottom}`);
    this.xAxisBottomRectA.setAttribute('fill', 'var(--plt-clr-2)');

    // LEFT
    this.yAxisLeftGroupA.setAttribute('transform', `translate(0,${this.sectionAattributes.margins.top})`);
    this.yAxisLeftRectA.setAttribute('width', `${this.sectionAattributes.margins.right}`);
    this.yAxisLeftRectA.setAttribute('height', `${this.sectionAattributes.height - this.sectionAattributes.margins.top - this.sectionAattributes.margins.bottom}`);
    this.yAxisLeftRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisLeftA.setAttribute('id', 'LeftA');
    this.yAxisLeftA.setAttribute('transform', `translate(${this.sectionAattributes.margins.left},0)`);

    this.sectionA.setAttribute('transform', `0,32`);

/*    this.candlestick.gCandlestick.setAttribute('transform', `translate(${this.sectionA.margins.left, this.sectionA.margins.right})`);*/

    // SECTION A-1


    // SECTION B
    let bboxB = this.rectB.getBBox();
    this.sectionBattributes.width = bboxB.width;
    this.sectionBattributes.height = bboxB.height;
    console.log(this.sectionAattributes.height);
   this.macdChart.setAttribute('transform', `translate(32,391.5)`);

    // SECTION C
    let bboxC = this.rectC.getBBox();
    this.sectionCattributes.width = bboxC.width;
    this.sectionCattributes.height = bboxC.height;
   this.rsiGroup.setAttribute('transform', `translate(32,590.15)`);
  }

  alignChartsToScaffold(): void {

  }
}
