import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { JzPopoverPanelComponent } from '../jz-popover-panel/jz-popover-panel.component';
import {
  JZ_POPOVER_DATA,
  JZ_POPOVER_REF
} from '../jz-popover-injector.tokens';
import { JzPopoverRef } from '../jz-popover-ref';
//import { JZ_POPOVER_DATA } from '../tokens/jz-popover.tokens';
//import { JzPopoverRef } from '../models/jz-popover-ref';

export interface JzPopoverErrorData {
  title?: string;
  message?: string;
  technicalDetails?: string;
  allowRetry?: boolean;
}

@Component({
  selector: 'jz-popover-error',
  standalone: true,
  imports: [
    CommonModule,
    JzPopoverPanelComponent
  ],
  templateUrl: './jz-popover-error.component.html',
  styleUrls: ['./jz-popover-error.component.scss']
})
export class JzPopoverErrorComponent {

  constructor(
    @Optional() @Inject(JZ_POPOVER_DATA)
    public data: JzPopoverErrorData | null,

    @Optional()
    private readonly popoverRef: JzPopoverRef
  ) {
  }

  get title(): string {
    return this.data?.title || 'Error';
  }

  get message(): string {
    return this.data?.message || 'An unexpected error occurred.';
  }

  get technicalDetails(): string {
    return this.data?.technicalDetails || '';
  }

  get allowRetry(): boolean {
    return this.data?.allowRetry === true;
  }

  ok(): void {
    this.popoverRef?.close('ok');
  }

  retry(): void {
    this.popoverRef?.close('retry');
  }
}
