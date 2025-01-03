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

  rectXaxisTopA!: SVGRectElement;
  rectXaxisBottomA!: SVGRectElement;
  rectYaxisLeftA!: SVGRectElement;
  rectYaxisRightA!: SVGRectElement;

  rectCandlestick: any;

  constructor() { }

  createSections(): void {
    // SECTION A
    let bbox = this.rectA.getBBox();
    this.sectionA.width = bbox.width;
    this.sectionA.height = bbox.height;
    //this.rectCandlestick.width = this.svgWidth;

    this.rectXaxisTopA.setAttribute('x', `${this.sectionA.margins.left}`);
    this.rectXaxisTopA.setAttribute('id', 'TopA');
    this.rectXaxisTopA.setAttribute('width', `${this.sectionA.width - this.sectionA.margins.left - this.sectionA.margins.right}`);
    this.rectXaxisTopA.setAttribute('height', `${this.sectionA.margins.top}`);
    this.rectXaxisTopA.setAttribute('fill', 'yellow');

    this.rectYaxisRightA.setAttribute('x', `${-this.sectionA.width}`);
    this.rectYaxisRightA.setAttribute('width', `${this.sectionA.margins.right}`);
    this.rectYaxisRightA.setAttribute('height', `${this.sectionA.height - this.sectionA.margins.bottom}`);

    this.rectXaxisBottomA.setAttribute('x', '0');
    this.rectXaxisBottomA.setAttribute('id', 'BottomA');
    this.rectXaxisBottomA.setAttribute('fill', 'white');
    this.rectXaxisBottomA.setAttribute('width', `${this.sectionA.width-this.sectionA.margins.left-this.sectionA.margins.right}`);
    this.rectXaxisBottomA.setAttribute('height', `${this.sectionA.margins.bottom}`);
    this.rectXaxisBottomA.setAttribute('transform', `translate(${this.sectionA.margins.left},0`);

    this.rectYaxisLeftA.setAttribute('x', `${-this.sectionA.margins.left}`);
    this.rectYaxisLeftA.setAttribute('id', 'LeftA');
    this.rectYaxisLeftA.setAttribute('fill', 'white');
    this.rectYaxisLeftA.setAttribute('width',`${ this.sectionA.margins.left}`);
    this.rectYaxisLeftA.setAttribute('height', `${this.sectionA.height - this.sectionA.margins.top - this.sectionA.margins.bottom}`);



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
