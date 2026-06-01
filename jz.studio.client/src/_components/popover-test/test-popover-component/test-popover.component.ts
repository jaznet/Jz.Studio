import { Component, Inject } from '@angular/core';

import { JzPopoverPanelComponent }
  from '../../../_framework/ui/popover/jz-popover-panel/jz-popover-panel.component';

import { JZ_POPOVER_DATA }
  from '../../../_framework/ui/popover/jz-popover-injector.tokens';

@Component({
  selector: 'test-popover',
  standalone: true,
  imports: [
    JzPopoverPanelComponent
  ],
  templateUrl: './test-popover.component.html',
  styleUrls: ['./test-popover.component.scss']
})
export class TestPopoverComponent {

  testPopoverComponent = TestPopoverComponent;

  constructor(
    @Inject(JZ_POPOVER_DATA)
    public readonly data: any
  ) {
  }
}
