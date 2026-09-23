import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  TemplateRef,
  Type,
  ViewContainerRef
} from '@angular/core';

import { JzPopoverService } from './jz-popover.service';
import { JzPopoverRef } from './jz-popover-ref';
import {
  JzPopoverConfig,
  JzPopoverContent
} from './jz-popover.types';

@Directive({
  selector: '[jzPopover]',
  standalone: true
})
export class JzPopoverDirective {
  @Input('jzPopover') content!: JzPopoverContent;
  @Input() jzPopoverConfig: JzPopoverConfig = {};
  @Input() jzPopoverOrigin?: ElementRef<HTMLElement> | HTMLElement;

  private popoverRef?: JzPopoverRef;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly popoverService: JzPopoverService
  ) { }

  @HostListener('click')
  toggle(): void {
    if (this.popoverRef?.hasAttached()) {
      this.close();
      return;
    }

    this.open();
  }

  open(): void {
    if (!this.content) {
      return;
    }

    const origin = this.getOrigin();

    if (this.content instanceof TemplateRef) {
      this.popoverRef = this.popoverService.openTemplate(
        origin,
        this.content,
        this.viewContainerRef,
        this.jzPopoverConfig
      );
    } else {
      this.popoverRef = this.popoverService.openComponent(
        origin,
        this.content as Type<unknown>,
        this.jzPopoverConfig
      );
    }

    this.popoverRef.afterClosed$.subscribe(() => {
      this.popoverRef = undefined;
    });
  }

  close(): void {
    this.popoverRef?.close();
    this.popoverRef = undefined;
  }

  private getOrigin(): ElementRef<HTMLElement> | HTMLElement {
    return this.jzPopoverOrigin ?? this.elementRef;
  }
}
