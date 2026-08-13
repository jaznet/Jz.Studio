import { Component, Inject } from '@angular/core';

import {
  JZ_POPOVER_DATA,
  JzPopoverPanelComponent
} from 'ui-interaction';

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
