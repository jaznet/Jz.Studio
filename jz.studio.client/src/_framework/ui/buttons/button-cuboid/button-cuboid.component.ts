import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonBaseComponent } from '../base/button-base';
import { JzButtonSize, JzButtonVariant } from '../_core/jz-button-types';

@Component({
  selector: 'button-cuboid',
  standalone: true,
  imports: [ButtonBaseComponent],
  templateUrl: './button-cuboid.component.html',
  styleUrls: ['./button-cuboid.component.scss']
})
export class ButtonCuboidComponent {
  @Input() route?: string;
  @Input() jzDisabled = false;
  @Input() jzVariant: JzButtonVariant = 'primary';
  @Input() jzSize: JzButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Output() clicked = new EventEmitter<void>();

  constructor(private readonly router: Router) { }

  onActivated(): void {
    this.clicked.emit();

    if (this.route) {
      this.router.navigateByUrl(this.route);
    }
  }
}
