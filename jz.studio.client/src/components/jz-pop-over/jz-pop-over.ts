 // jz-pop-over.ts

import { AfterViewInit, Component, ElementRef, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jz-pop-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-pop-over.html',
  styleUrl: './jz-pop-over.scss'
})
export class JzPopOver implements AfterViewInit {
  @Input() content!: TemplateRef<unknown>;
  @Input() visible = false;   // <-- template can use [class.visible]="visible"
  @Input() anchor?: HTMLElement;

  constructor(private elementRef: ElementRef) { }   // 👈 injects this component's DOM element

  ngAfterViewInit(): void {
    if (this.anchor) {
      const rect = this.anchor.getBoundingClientRect();
      const el = this.elementRef.nativeElement.querySelector('.jz-popover');
      el.style.position = 'absolute';
      el.style.top = `${rect.bottom + 8}px`;
      el.style.left = `${rect.left}px`;
    }
  }
}
