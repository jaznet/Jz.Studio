import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import {
  JzPopoverDirective,
  JzPopoverPanelComponent
} from 'ui-interaction';
import { TestPopoverComponent } from './test-popover-component/test-popover.component';

@Component({
  selector: 'popover-test',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    JzPopoverDirective,
    JzPopoverPanelComponent
  ],
  templateUrl: './popover-test.component.html',
  styleUrls: ['./popover-test.component.scss']
})
export class PopoverTestComponent {
  readonly componentPopover = TestPopoverComponent;

  get viewRouterOrigin(): HTMLElement | undefined {
    return document.getElementById('viewRouter') ?? undefined;
  }
}
