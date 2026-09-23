import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jz-pebble-button',
  standalone: true,
  templateUrl: './jz-pebble-button.component.html',
  styleUrls: ['./jz-pebble-button.component.scss']
})
export class JzPebbleButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<MouseEvent>();
}
