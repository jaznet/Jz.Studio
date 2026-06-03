import { Component, Inject } from '@angular/core';
import { JzPopoverBaseComponent } from '../jz-popover-base/jz-popover-base.component';
import { JZ_POPOVER_DATA } from '../jz-popover-injector.tokens';
import { JzPopoverLoadingData } from '../models/jz-popover-loading-data';

@Component({
  selector: 'jz-popover-loading',
  standalone: true,
  imports: [JzPopoverBaseComponent],
  templateUrl: './jz-popover-loading.component.html',
  styleUrl: './jz-popover-loading.component.scss'
})
export class JzPopoverLoadingComponent {
  constructor(
    @Inject(JZ_POPOVER_DATA)
    public readonly data: JzPopoverLoadingData
  ) { }
}
