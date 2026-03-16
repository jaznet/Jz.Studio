// button-cuboid.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonBaseComponent } from '../base/button-base';
import { ButtonInteractionService } from '../_core/button-interaction.service';

@Component({
  selector: 'button-cuboid',
  standalone: true,
  templateUrl: './button-cuboid.component.html',
  styleUrls: ['./button-cuboid.component.scss'],
  providers: [ButtonInteractionService]
})
export class ButtonCuboidComponent extends ButtonBaseComponent {
  @Input() route?: string;
  @Output() clicked = new EventEmitter<void>();

  constructor(
    interaction: ButtonInteractionService,
    private readonly router: Router
  ) {
    super(interaction);
  }

  onButtonClick(event: MouseEvent): void {
    console.log('button-cuboid real button clicked', event);
    this.onClick(event);
  }

  protected override emitActivation(): void {
    super.emitActivation();
    this.clicked.emit();

    if (this.route) {
      this.router.navigateByUrl(this.route);
    }
  }
}
