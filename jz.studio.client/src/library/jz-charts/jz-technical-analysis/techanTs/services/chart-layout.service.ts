import { Injectable } from '@angular/core';
import { SectionAttributes } from '../interfaces/techan-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ChartLayoutService {

  svg!: any;
  svgWidth = 0;
  svgHeight = 0;
  svgRect!: any;
  svgRectWidth = 0;
  svgRectHeight = 0;

  sectionA: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 20, right: 32, bottom: 20, left: 32 } };
  sectionB: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 20, right: 30, bottom: 20, left: 30 } };
  sectionC: SectionAttributes = { x: 0, y: 0, width: 0, height: 0, margins: { top: 20, right: 30, bottom: 20, left: 30 } };

  rectA!: { nativeElement: { getBBox: () => any; }; };
  rectB!: { nativeElement: { getBBox: () => any; }; };
  rectC!: { nativeElement: { getBBox: () => any; }; };

  rectYaxis: any;
  rectCandlestick: any;

  constructor() { }

  createSections(): void {
    // SECTION A
    let bbox = this.rectA.nativeElement.getBBox();
    this.sectionA.width = bbox.width;
    this.sectionA.height = bbox.height;
    //this.rectCandlestick.width = this.svgWidth;
    //this.rectCandlestick.height = this.svgHeight*.5;
    this.rectYaxis.setAttribute('x', -this.sectionA.margins.left);
    this.rectYaxis.setAttribute('width', this.sectionA.margins.left);
    this.rectYaxis.setAttribute('height', this.sectionA.height - this.sectionA.margins.bottom);
    this.rectCandlestick.setAttribute('width', this.svgWidth - this.sectionA.margins.left - this.sectionA.margins.right);
    this.rectCandlestick.setAttribute('height', (this.svgHeight * .5) - this.sectionA.margins.top - this.sectionA.margins.bottom);

    // SECTION B
    bbox = this.rectB.nativeElement.getBBox();
    this.sectionB.width = bbox.width;
    this.sectionB.height = bbox.height;

    // SECTION C
    bbox = this.rectC.nativeElement.getBBox();
    this.sectionC.width = bbox.width;
    this.sectionC.height = bbox.height;
  }
}
