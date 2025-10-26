// jz-popovers.service.ts
import { Injectable, Injector, TemplateRef } from '@angular/core';
import { Overlay, OverlayRef, OverlayPositionBuilder } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { JzPopOverComponent } from './jz-pop-over';

@Injectable({ providedIn: 'root' })
export class JzPopoversService {
  private overlayRef?: OverlayRef;

  constructor(
    private overlay: Overlay,
    private positionBuilder: OverlayPositionBuilder,
    private injector: Injector
  ) { }

  open(origin: HTMLElement, content: TemplateRef<any>) {
    this.close();

    const positionStrategy = this.positionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
        { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const compRef = this.overlayRef.attach<JzPopOverComponent>(
      new ComponentPortal(JzPopOverComponent, null, this.injector)
    );
    compRef.instance.content = content;
    compRef.instance.visible = true;

    // 🔑 Ensure template bindings apply before paint
    compRef.changeDetectorRef.detectChanges();

    this.overlayRef.backdropClick().subscribe(() => this.close());
  }

  close() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
