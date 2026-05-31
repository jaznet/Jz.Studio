import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { JzPopoverService } from '../../_framework/ui/popover/jz-popover.service';
import { JzPopoverRef } from '../../_framework/ui/popover/jz-popover-ref';
import { JzPopoverPanelComponent } from '../../_framework/ui/popover/jz-popover-panel/jz-popover-panel.component';

@Component({
  selector: 'popover-test',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    JzPopoverPanelComponent
  ],
  templateUrl: './popover-test.component.html',
  styleUrls: ['./popover-test.component.scss']
})
export class PopoverTestComponent {
  @ViewChild('trigger', { read: ElementRef })
  triggerRef!: ElementRef<HTMLElement>;

  @ViewChild('popoverTemplate')
  popoverTemplate!: TemplateRef<unknown>;

  private popoverRef?: JzPopoverRef;

  constructor(
    private readonly popoverService: JzPopoverService,
    private readonly viewContainerRef: ViewContainerRef
  ) { }

  openPopover(): void {
    if (this.popoverRef?.hasAttached()) {
      return;
    }

    this.popoverRef = this.popoverService.openTemplate(
      this.triggerRef,
      this.popoverTemplate,
      this.viewContainerRef,
      {
        placement: 'bottom-start',
        hasBackdrop: true,
        closeOnBackdropClick: true,
        closeOnEscape: true,
        offsetY: 8
      }
    );

    this.popoverRef.afterClosed$.subscribe(() => {
      this.popoverRef = undefined;
    });
  }

  closePopover(): void {
    this.popoverRef?.close();
    this.popoverRef = undefined;
  }

  togglePopover(): void {
    if (this.popoverRef?.hasAttached()) {
      this.closePopover();
      return;
    }

    this.openPopover();
  }
}
