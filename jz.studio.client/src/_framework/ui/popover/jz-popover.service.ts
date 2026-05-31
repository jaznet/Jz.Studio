import {
  ElementRef,
  Injectable,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import {
  Overlay,
  OverlayRef
} from '@angular/cdk/overlay';

import { TemplatePortal } from '@angular/cdk/portal';

import {
  getJzPopoverPositions,
  JzPopoverConfig
} from './jz-popover.types';

import { JzPopoverRef } from './jz-popover-ref';

@Injectable({
  providedIn: 'root'
})
export class JzPopoverService {
  private activePopoverRef?: JzPopoverRef;

  constructor(private readonly overlay: Overlay) { }

  openTemplate(
    origin: ElementRef<HTMLElement>,
    templateRef: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config: JzPopoverConfig = {}
  ): JzPopoverRef {
    this.closeActive();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(getJzPopoverPositions(config.placement))
      .withFlexibleDimensions(false)
      .withPush(true)
      .withDefaultOffsetX(config.offsetX ?? 0)
      .withDefaultOffsetY(config.offsetY ?? 8);

    const overlayRef: OverlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: config.hasBackdrop ?? true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: config.panelClass ?? 'jz-popover-overlay-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    const popoverRef = new JzPopoverRef(overlayRef);
    this.activePopoverRef = popoverRef;

    overlayRef.attach(new TemplatePortal(templateRef, viewContainerRef));

    if (config.closeOnBackdropClick ?? true) {
      overlayRef.backdropClick().subscribe(() => popoverRef.close());
    }

    if (config.closeOnEscape ?? true) {
      overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') {
          popoverRef.close();
        }
      });
    }

    popoverRef.afterClosed$.subscribe(() => {
      if (this.activePopoverRef === popoverRef) {
        this.activePopoverRef = undefined;
      }
    });

    return popoverRef;
  }

  closeActive(): void {
    this.activePopoverRef?.close();
    this.activePopoverRef = undefined;
  }
}
