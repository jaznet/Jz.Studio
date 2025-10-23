// jz-pop-over.ts
import { Component, Input, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'jz-pop-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-pop-over.html',
  styleUrl: './jz-pop-over.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JzPopOver {
  @Input() content!: TemplateRef<unknown>;
  @Input() visible = false;

  /** set by the service; we compute arrowPos and request a new tick */
  @Input() set position(p: ConnectedPosition | undefined) {
    this._position = p;
    this.arrowPos = this.computeArrow(p);
    // we’ll call markForCheck() from the service after setting position
  }
  get position() { return this._position; }
  private _position?: ConnectedPosition;

  /** what the template binds to */
  arrowPos: 'top' | 'bottom' | 'left' | 'right' = 'top';

  constructor(public cdr: ChangeDetectorRef) { }

  private computeArrow(p?: ConnectedPosition) {
    if (!p) return 'top';
    if (p.overlayY === 'top') return 'bottom';
    if (p.overlayY === 'bottom') return 'top';
    if (p.overlayX === 'start') return 'right';
    return 'left';
  }
}
