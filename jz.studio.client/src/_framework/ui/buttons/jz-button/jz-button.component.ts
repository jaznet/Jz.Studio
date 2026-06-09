import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type JzButtonVariant =
  | 'primary'
  | 'ghost'
  | 'glass'
  | 'gold';

export type JzButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

@Component({
  selector: 'jz-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-button.component.html',
  styleUrls: ['./jz-button.component.scss']
})
export class JzButtonComponent {
  @Input() variant: JzButtonVariant = 'primary';
  @Input() size: JzButtonSize = 'md';
  @Input() disabled = false;
  @Input() active = false;
  @Input() icon?: string;
  @Input() label?: string;
}
