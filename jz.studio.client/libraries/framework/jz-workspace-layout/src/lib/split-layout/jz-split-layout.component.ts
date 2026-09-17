import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SplitDirection } from './split-direction.type';

@Component({
  selector: 'jz-split-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-split-layout.component.html',
  styleUrls: ['./jz-split-layout.component.scss']
})
export class JzSplitLayoutComponent {

  @Input() direction: SplitDirection = 'horizontal';
  @Input() secondaryVisible = true;
  @Input() minPrimarySize = 20;
  @Input() minSecondarySize = 20;

  @Output() primarySizeChange = new EventEmitter<number>();

  private _primarySize = 50;
  private dragging = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  @Input()
  set primarySize(value: number) {
    this._primarySize = this.clampSize(value);
  }

  get primarySize(): number {
    return this._primarySize;
  }

  get separatorOrientation(): 'horizontal' | 'vertical' {
    return this.direction === 'horizontal'
      ? 'vertical'
      : 'horizontal';
  }

  onPointerDown(event: PointerEvent): void {
    if (!this.secondaryVisible) {
      return;
    }

    this.dragging = true;
    event.preventDefault();
    (event.currentTarget as HTMLElement)
      .setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    const bounds = this.elementRef.nativeElement
      .getBoundingClientRect();

    const position = this.direction === 'horizontal'
      ? event.clientX - bounds.left
      : event.clientY - bounds.top;

    const availableSize = this.direction === 'horizontal'
      ? bounds.width
      : bounds.height;

    if (availableSize <= 0) {
      return;
    }

    this.updatePrimarySize(
      position / availableSize * 100
    );
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    (event.currentTarget as HTMLElement)
      .releasePointerCapture(event.pointerId);
  }

  onSeparatorKeydown(event: KeyboardEvent): void {
    const decreaseKey = this.direction === 'horizontal'
      ? 'ArrowLeft'
      : 'ArrowUp';

    const increaseKey = this.direction === 'horizontal'
      ? 'ArrowRight'
      : 'ArrowDown';

    if (event.key === decreaseKey) {
      this.updatePrimarySize(this.primarySize - 2);
    } else if (event.key === increaseKey) {
      this.updatePrimarySize(this.primarySize + 2);
    } else {
      return;
    }

    event.preventDefault();
  }

  private updatePrimarySize(value: number): void {
    const nextSize = this.clampSize(value);

    if (nextSize === this.primarySize) {
      return;
    }

    this._primarySize = nextSize;
    this.primarySizeChange.emit(nextSize);
  }

  private clampSize(value: number): number {
    const maximumPrimarySize = 100 - this.minSecondarySize;

    return Math.min(
      Math.max(value, this.minPrimarySize),
      maximumPrimarySize
    );
  }
}
