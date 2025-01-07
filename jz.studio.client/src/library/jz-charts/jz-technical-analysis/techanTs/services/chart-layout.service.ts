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

  rectCandlestick: any;

  constructor() { }

  createSections(): void {
    // SECTION A
    let bbox = this.rectA.getBBox();
    this.sectionA.width = bbox.width;
    this.sectionA.height = bbox.height;
    this.rectCandlestick.setAttribute('width', this.svgWidth);

    // TOP
    this.xAxisTopGroupA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);
    this.xAxisTopRectA.setAttribute('width', `${this.sectionA.width - this.sectionA.margins.left - this.sectionA.margins.right}`);
    this.xAxisTopRectA.setAttribute('height', `${this.sectionA.margins.top}`);
    this.xAxisTopRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.xAxisTopA.setAttribute('id', 'TopA');
    this.xAxisTopA.setAttribute('transform', `translate(0,${this.sectionA.margins.top})`);

    // RIGHT
/*    this.yAxisRightA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);*/
    this.yAxisRightGroupA.setAttribute('transform', `translate(${this.sectionA.width-this.sectionA.margins.right},${this.sectionA.margins.top})`);
    this.yAxisRightRectA.setAttribute('width', `${this.sectionA.margins.right}`);
    this.yAxisRightRectA.setAttribute('height', `${ this.sectionA.height - this.sectionA.margins.top - this.sectionA.margins.bottom}`);
    this.yAxisRightRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisRightA.setAttribute('id', 'RightA');

    // BOTTOM
    this.xAxisBottomA.setAttribute('id', 'BottomA');
    this.xAxisBottomA.setAttribute('transform', `translate(${this.sectionA.margins.left}, ${this.sectionA.height-this.sectionA.margins.bottom})`);
    this.xAxisBottomRectA.setAttribute('width', `${this.sectionA.width - this.sectionA.margins.left - this.sectionA.margins.right}`);
    this.xAxisBottomRectA.setAttribute('height', `${this.sectionA.margins.bottom}`);
    this.xAxisBottomRectA.setAttribute('fill', 'var(--plt-clr-2)');

    // LEFT
    this.yAxisLeftGroupA.setAttribute('transform', `translate(0,${this.sectionA.margins.top})`);
    this.yAxisLeftRectA.setAttribute('width', `${this.sectionA.margins.right}`);
    this.yAxisLeftRectA.setAttribute('height', `${this.sectionA.height - this.sectionA.margins.top - this.sectionA.margins.bottom}`);
    this.yAxisLeftRectA.setAttribute('fill', 'var(--plt-clr-2)');
    this.yAxisLeftA.setAttribute('id', 'LeftA');
    this.yAxisLeftA.setAttribute('transform', `translate(${this.sectionA.margins.left},0)`);

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
