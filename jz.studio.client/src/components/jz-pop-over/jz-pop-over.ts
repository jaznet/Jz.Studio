 // jz-pop-over.ts


import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jz-pop-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-pop-over.html',
  styleUrl: './jz-pop-over.scss'
})
export class JzPopOver {
  @Input() content!: TemplateRef<unknown>;
  @Input() visible = false;   // <-- template can use [class.visible]="visible"
}
