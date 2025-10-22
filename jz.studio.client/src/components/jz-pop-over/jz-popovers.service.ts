import { Injectable, Injector, TemplateRef } from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
  OverlayPositionBuilder
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { JzPopOver } from './jz-pop-over'; // adjust import path if needed

@Injectable({ providedIn: 'root' })
export class JzPopoversService {
  private overlayRef?: OverlayRef;

  constructor(
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder,
    private injector: Injector
  ) { }

  /**
   * Opens a JzPopOver overlay connected to a specific element.
   * @param origin - The DOM element to anchor the popover to.
   * @param content - The TemplateRef to inject into the popover.
   */
  open(origin: HTMLElement, content: TemplateRef<unknown>): void {
    // Close any previous popover
    this.close();

    // Define how the popover positions itself relative to the target
    const positionStrategy = this.positionBuilder
      .flexibleConnectedTo(origin)
      .withFlexibleDimensions(false)
      .withPush(true)
      .withPositions([
        // Primary: below center
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8
        },
        // Fallback: above center
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8
        }
      ]);

    // Create overlay configuration
    const config: OverlayConfig = {
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      disposeOnNavigation: true
    };

    // Create the overlay
    this.overlayRef = this.overlay.create(config);

    // Attach the JzPopOver component into it
    const portal = new ComponentPortal(JzPopOver, null, this.injector);
    const compRef = this.overlayRef.attach(portal);

    // Pass data into the component instance
    compRef.instance.content = content;
    compRef.instance.visible = true;

    // Close on backdrop click
    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  /** Closes and disposes the current popover overlay. */
  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
