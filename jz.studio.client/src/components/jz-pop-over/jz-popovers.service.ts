// jz-popovers.service.ts
import { Injectable, Injector, TemplateRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { JzPopOver } from './jz-pop-over';

@Injectable({ providedIn: 'root' })
export class JzPopoversService {
  private overlayRef?: OverlayRef;

  constructor(private overlay: Overlay, private pos: OverlayPositionBuilder, private injector: Injector) { }

  open(origin: HTMLElement, content: TemplateRef<unknown>) {
    this.close();

    const positionStrategy = this.pos.flexibleConnectedTo(origin)
      .withFlexibleDimensions(true)
      .withPush(true)
      .withPositions([
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
        { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
      ]);

    const cfg: OverlayConfig = {
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      disposeOnNavigation: true,
    };

    this.overlayRef = this.overlay.create(cfg);

    const portal = new ComponentPortal(JzPopOver, null, this.injector);
    const cmpRef = this.overlayRef.attach(portal);
    cmpRef.instance.content = content;
    cmpRef.instance.visible = true;

    // When CDK reports a new connection, update input and schedule a new tick
    positionStrategy.positionChanges.subscribe(({ connectionPair }) => {
      cmpRef.instance.position = connectionPair as ConnectedPosition;

      // Defer marking for check to the next macrotask to avoid NG0100
      setTimeout(() => cmpRef.changeDetectorRef.markForCheck());
      // (queueMicrotask is sometimes still same tick; setTimeout is safer here)
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(e => { if (e.key === 'Escape') this.close(); });
  }

  close() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
