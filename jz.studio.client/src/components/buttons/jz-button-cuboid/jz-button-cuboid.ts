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
      const width = 240, height = 240;
      const r = 180;

      const svg = select(this.topRightRef.nativeElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const defs = svg.append("defs");

      // Linear gradient (you can rotate it by changing x1,y1,x2,y2)
      const grad = defs.append("linearGradient")
        .attr("id", "qgrad")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", r).attr("y2", 0);

      console.log(defs);

      grad.append("stop").attr("offset", "0%").attr("stop-color", "#4f46e5");
      grad.append("stop").attr("offset", "100%").attr("stop-color", "#22c55e");

      // Quarter circle sector from 0° to 90° (top-right)
      type ArcDatum = {
        innerRadius: number;
        outerRadius: number;
        startAngle: number;
        endAngle: number;
      };

      const a = arc<ArcDatum>()
        .innerRadius(d => d.innerRadius)
        .outerRadius(d => d.outerRadius)
        .startAngle(d => d.startAngle)
        .endAngle(d => d.endAngle);

      const d: ArcDatum = {
        innerRadius: 0,
        outerRadius: r,
        startAngle: 0,
        endAngle: Math.PI / 2
      };

      svg.append("path")
        .attr("transform", `translate(${30},${210})`)
        .attr("d", a(d) ?? "");

      //svg.append("path")
      //  .attr("transform", `translate(${30}, ${210})`) // move origin to bottom-left-ish
      //  .attr("d", a()!  )
      //  .attr("fill", "url(#qgrad)")
      //  .attr("stroke", "#111")
      //  .attr("stroke-width", 1);

    }

  onClick() { this.emitClicked(); }
}
