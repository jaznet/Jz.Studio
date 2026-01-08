// jz-button-cuboid.ts

import { AfterViewInit, Component, ElementRef, HostBinding, Renderer2, ViewChild } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';
import { select } from 'd3-selection';
import { arc } from 'd3-shape';

@Component({
  selector: 'jz-button-cuboid', // use the tag you actually place in templates
  standalone: true,
  templateUrl: './jz-button-cuboid.html',
  styleUrls: ['./jz-button-cuboid.scss']
})
export class JzButtonCuboid extends ButtonBase implements AfterViewInit {
  // make wrapper non-interactive & out of the a11y tree
  @HostBinding('attr.role') role: string | null = null;
  @HostBinding('attr.tabindex') tabIndex: string | null = null;
  @HostBinding('attr.aria-disabled') ariaDisabled: string | null = null;

  @ViewChild('topRight', { static: false }) topRightRef!: ElementRef<HTMLElement>;


  constructor(el: ElementRef, renderer: Renderer2) {
    super();
    // belt-and-suspenders: remove any attributes Angular might have inherited 
    renderer.removeAttribute(el.nativeElement, 'role');
    renderer.removeAttribute(el.nativeElement, 'tabindex');
    renderer.removeAttribute(el.nativeElement, 'aria-disabled');
  }

    ngAfterViewInit(): void {
      const size = this.bevelWidth;   // e.g. 8 or 24
      const r = size;

      const svg = select(this.topRightRef.nativeElement)
        .append("svg")
        .attr("width", size)
        .attr("height", size)
        .attr("viewBox", `0 0 ${size} ${size}`);

      const defs = svg.append("defs");


      const grad = defs.append("linearGradient")
        .attr("id", " arcLinearGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", this.bevelWidth).attr("y2", 0);

      console.log(grad);

      grad.append("stop").attr("offset", "0%").attr("stop-color", "yellow");
      grad.append("stop").attr("offset", "100%").attr("stop-color", "blue");

      // Quarter circle sector from 0° to 90° (top-right)
      type ArcDatum = {
        innerRadius: number ;
        outerRadius: number;
        startAngle: number;
        endAngle: number;
      };

      const d: ArcDatum = {
        innerRadius: 0,
        outerRadius: this.bevelWidth,
        startAngle: 0,
        endAngle: Math.PI / 2
      };

      const a = arc<ArcDatum>()
        .innerRadius(d => d.outerRadius)   // <- same as outer, makes it a ring segment
        .outerRadius(d => d.outerRadius)
        .startAngle(d => d.startAngle)
        .endAngle(d => d.endAngle);

      // Linear gradient (you can rotate it by changing x1,y1,x2,y2)
      const gradId = `arcLinearGradient-${crypto.randomUUID()}`;

      svg.append("g")
        .attr("transform", `translate(0,${r})`) // for top-right corner
        .append("path")
        .attr("d", a(d) ?? "")
        .attr("fill", "none")
        .attr("stroke", `white`)
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round");

    }

  onClick() { this.emitClicked(); }
}
