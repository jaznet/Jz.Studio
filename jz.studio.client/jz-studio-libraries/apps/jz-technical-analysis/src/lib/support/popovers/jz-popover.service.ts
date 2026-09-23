import {
  ElementRef,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

import {
  getJzPopoverPositions,
  JzPopoverConfig
} from './jz-popover.types';

import { JzPopoverRef } from './jz-popover-ref';
import { JZ_POPOVER_DATA, JZ_POPOVER_REF } from './jz-popover-injector.tokens';

@Injectable({
  providedIn: 'root'
})
export class JzPopoverService {
  private activePopoverRef?: JzPopoverRef;

  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) { }

  openTemplate(
    origin: ElementRef<HTMLElement> | HTMLElement,
    templateRef: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    config: JzPopoverConfig = {}
  ): JzPopoverRef {
    const overlayRef = this.createOverlay(origin, config);
    const popoverRef = this.createPopoverRef(overlayRef);

    overlayRef.attach(new TemplatePortal(templateRef, viewContainerRef));
    this.wireCloseBehavior(overlayRef, popoverRef, config);
    this.applyContainerCenterPosition(origin, overlayRef, config);

    return popoverRef;
  }

  openComponent<TComponent>(
    origin: ElementRef<HTMLElement> | HTMLElement,
    componentType: Type<TComponent>,
    config: JzPopoverConfig = {}
  ): JzPopoverRef {
    const overlayRef = this.createOverlay(origin, config);
    const popoverRef = this.createPopoverRef(overlayRef);

    const popoverInjector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: JZ_POPOVER_REF, useValue: popoverRef },
        { provide: JZ_POPOVER_DATA, useValue: config.data }
      ]
    });

    overlayRef.attach(
      new ComponentPortal(
        componentType,
        null,
        popoverInjector
      )
    );

    this.wireCloseBehavior(overlayRef, popoverRef, config);
    this.applyContainerCenterPosition(origin, overlayRef, config);

    return popoverRef;
  }

  closeActive(): void {
    this.activePopoverRef?.close();
    this.activePopoverRef = undefined;
  }

  private createOverlay(
    origin: ElementRef<HTMLElement> | HTMLElement,
    config: JzPopoverConfig
  ): OverlayRef {
    this.closeActive();

    if (config.positionMode === 'container-center') {
      return this.overlay.create({
        positionStrategy: this.overlay.position().global(),
        hasBackdrop: config.hasBackdrop ?? true,
        backdropClass: 'cdk-overlay-transparent-backdrop',
        panelClass: config.panelClass ?? 'jz-popover-overlay-panel',
        scrollStrategy: this.overlay.scrollStrategies.reposition()
      });
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(getJzPopoverPositions(config.placement))
      .withFlexibleDimensions(false)
      .withPush(true)
      .withDefaultOffsetX(config.offsetX ?? 0)
      .withDefaultOffsetY(config.offsetY ?? 8);

    return this.overlay.create({
      positionStrategy,
      hasBackdrop: config.hasBackdrop ?? true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: config.panelClass ?? 'jz-popover-overlay-panel',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
  }

  private applyContainerCenterPosition(
    origin: ElementRef<HTMLElement> | HTMLElement,
    overlayRef: OverlayRef,
    config: JzPopoverConfig
  ): void {
    if (config.positionMode !== 'container-center') {
      return;
    }

    requestAnimationFrame(() => {
      const originElement = this.getOriginElement(origin);
      const originRect = originElement.getBoundingClientRect();

      const overlayElement = overlayRef.overlayElement;
      const contentElement =
        overlayElement.querySelector('jz-popover-panel') as HTMLElement
        ?? overlayElement.firstElementChild as HTMLElement
        ?? overlayElement;

      const contentRect = contentElement.getBoundingClientRect();

      const left =
        originRect.left +
        (originRect.width - contentRect.width) / 2 +
        (config.offsetX ?? 0);

      const top =
        originRect.top +
        (originRect.height - contentRect.height) / 2 +
        (config.offsetY ?? 0);

      const positionStrategy = this.overlay
        .position()
        .global()
        .left(`${left}px`)
        .top(`${top}px`);

      overlayRef.updatePositionStrategy(positionStrategy);
      overlayRef.updatePosition();
    });
  }

  private getOriginElement(
    origin: ElementRef<HTMLElement> | HTMLElement
  ): HTMLElement {
    return origin instanceof ElementRef
      ? origin.nativeElement
      : origin;
  }

  private createPopoverRef(overlayRef: OverlayRef): JzPopoverRef {
    const popoverRef = new JzPopoverRef(overlayRef);
    this.activePopoverRef = popoverRef;

    popoverRef.afterClosed$.subscribe(() => {
      if (this.activePopoverRef === popoverRef) {
        this.activePopoverRef = undefined;
      }
    });

    return popoverRef;
  }

  private wireCloseBehavior(
    overlayRef: OverlayRef,
    popoverRef: JzPopoverRef,
    config: JzPopoverConfig
  ): void {
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
  }
}
