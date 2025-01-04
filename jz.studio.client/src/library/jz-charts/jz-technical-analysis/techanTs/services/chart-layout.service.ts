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

  sectionA: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };
  sectionB: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };
  sectionC: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 32, right: 32, bottom: 32, left: 32 } };

  rectA!: SVGRectElement;
  rectB!: SVGRectElement;
  rectC!: SVGRectElement;

  xAxisTopA!: SVGGElement;
  xAxisTopRectA!: SVGRectElement;

  yAxisRightA!: SVGGElement;
  yAxisRightRectA!: SVGRectElement;

  xAxisBottomA!: SVGGElement;
  xAxisBottomRectA!: SVGRectElement;

  yAxisLeftA!: SVGGElement;
  yAxisLeftRectA!: SVGRectElement;

  rectCandlestick: any;

  constructor() { }

  createSections(): void {
    // SECTION A
    let bbox = this.rectA.getBBox();
    this.sectionA.width = bbox.width;
    this.sectionA.height = bbox.height;
    this.rectCandlestick.setAttribute('width', this.svgWidth);

    this.xAxisTopA.setAttribute('x', `${this.sectionA.margins.left}`);
    this.xAxisTopA.setAttribute('id', 'TopA');
    this.xAxisTopA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);
    this.xAxisTopRectA.setAttribute('width', `${this.sectionA.width - this.sectionA.margins.left - this.sectionA.margins.right}`);
    this.xAxisTopRectA.setAttribute('height', `${this.sectionA.margins.top}`);
    this.xAxisTopRectA.setAttribute('fill', 'yellow');

    this.yAxisRightA.setAttribute('x', `${this.sectionA.width-this.sectionA.margins.right}`);
    this.yAxisRightA.setAttribute('id', 'RightA');
    this.yAxisRightA.setAttribute('fill', 'gold');
    this.yAxisRightA.setAttribute('width', `${this.sectionA.margins.right}`);
    this.yAxisRightA.setAttribute('height', `${this.sectionA.height - this.sectionA.margins.top - this.sectionA.margins.bottom}`);

    this.yAxisRightA.setAttribute('transform', `translate(${this.sectionA.margins.left},${this.sectionA.margins.top})`);

    // BOLTTOM
   // this.xAxisBottomA.setAttribute('x', '0');
    this.xAxisBottomA.setAttribute('id', 'BottomA');
    this.xAxisBottomA.setAttribute('fill', 'white');
    this.xAxisBottomA.setAttribute('width', `${this.sectionA.width-this.sectionA.margins.left-this.sectionA.margins.right}`);
    this.xAxisBottomA.setAttribute('height', `${this.sectionA.margins.bottom}`);
    this.xAxisBottomA.setAttribute('transform', `translate(${this.sectionA.margins.left},${this.sectionA.height})`);

    // LEFT
    this.yAxisLeftA.setAttribute('x', `${-this.sectionA.margins.left}`);
    this.yAxisLeftA.setAttribute('id', 'LeftA');
    this.yAxisLeftA.setAttribute('fill', 'white');
    this.yAxisLeftA.setAttribute('width',`${ this.sectionA.margins.left}`);
    this.yAxisLeftA.setAttribute('height', `${this.sectionA.height - this.sectionA.margins.top - this.sectionA.margins.bottom}`);

    this.rectCandlestick.setAttribute('width', this.svgWidth - this.sectionA.margins.left - this.sectionA.margins.right);
    this.rectCandlestick.setAttribute('height', (this.svgHeight * .5) - this.sectionA.margins.top - this.sectionA.margins.bottom);

    // SECTION B
    bbox = this.rectB.getBBox();
    this.sectionB.width = bbox.width;
    this.sectionB.height = bbox.height;

    // SECTION C
    bbox = this.rectC.getBBox();
    this.sectionC.width = bbox.width;
    this.sectionC.height = bbox.height;
  }
}
