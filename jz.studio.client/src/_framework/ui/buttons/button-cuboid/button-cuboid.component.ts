// button-cuboid.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonBaseComponent } from '../base/button-base';
import { ButtonInteractionService } from '../_core/button-interaction.service';

@Component({
  selector: 'jz-button-cuboid',
  standalone: true,
  templateUrl: './button-cuboid.component.html',
  styleUrls: ['./button-cuboid.component.scss'],
  providers: [ButtonInteractionService]
})
export class ButtonCuboidComponent extends ButtonBaseComponent {
  @Input() route?: string;

  constructor(
    interaction: ButtonInteractionService,
    private readonly router: Router
  ) {
    super(interaction);
  }
}
