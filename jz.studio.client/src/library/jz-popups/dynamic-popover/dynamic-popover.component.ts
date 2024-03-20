// dynamic-popover.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'dynamic-popover',
  templateUrl: './dynamic-popover.component.html',
  styleUrls: ['./dynamic-popover.component.css']
})
export class DynamicPopoverComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  isVisible: boolean = false;
  position = { top: 0, left: 0 };

  constructor() { }

  open({ title, content, position }: { title: string, content: string, position: { top: number, left: number } }) {
    this.title = title;
    this.content = content;
    this.position = position;
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
