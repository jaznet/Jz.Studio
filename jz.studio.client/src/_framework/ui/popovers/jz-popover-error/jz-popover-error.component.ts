import { Component, Inject } from '@angular/core';
import { JzPopoverPanelComponent } from '../jz-popover-panel/jz-popover-panel.component';
import { JzPopoverBaseComponent } from '../jz-popover-base/jz-popover-base.component';
import { JzPopoverDbError } from '../models/jz-popover-db-error';
import { JZ_POPOVER_DATA } from '../jz-popover-injector.tokens';

@Component({
  selector: 'jz-popover-error',
  standalone: true,
  templateUrl: './jz-popover-error.component.html',
  styleUrl: './jz-popover-error.component.scss',
  imports: [JzPopoverPanelComponent, JzPopoverBaseComponent]
})
export class JzPopoverErrorComponent
{
  constructor(
    @Inject(JZ_POPOVER_DATA)
    public readonly data: JzPopoverDbError
  ) { }
}
