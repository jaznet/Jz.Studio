import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy,
  SimpleChanges, TemplateRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jz-pop-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-pop-over.html',
  styleUrl: './jz-pop-over.scss',
})
export class JzPopOver implements AfterViewInit, OnChanges, OnDestroy {
  @Input() content!: TemplateRef<unknown>;
  @Input() visible = false;
  /** The element the popover should anchor to */
  @Input() anchor?: HTMLElement;

  private host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    // Initial compute if already visible & anchor exists
    this.reposition();
    // Keep aligned on scroll/resize
    window.addEventListener('scroll', this.reposition, true);
    window.addEventListener('resize', this.reposition, true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] || changes['anchor']) {
      // Defer so the class .visible has applied & template rendered
      queueMicrotask(() => this.reposition());
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition, true);
  }

  /** Use an arrow function so `this` stays bound for add/removeEventListener */
  private reposition = (): void => {
    const root = this.host.nativeElement; // the component's host
    const panel = root.querySelector('.jz-popover') as HTMLElement | null;
    if (!panel || !this.anchor || !this.visible) return;

    // Use viewport coordinates; keep popover in the viewport
    const rect = this.anchor.getBoundingClientRect();

    // Primary placement: bottom-center with 8px offset; fallback to top if clipped
    const spacing = 8;
    const panelWidth = panel.offsetWidth || 0;
    const panelHeight = panel.offsetHeight || 0;

    // Compute bottom placement
    let top = rect.bottom + spacing;
    let left = rect.left + Math.max(0, rect.width / 2 - panelWidth / 2);

    // If bottom would clip, try top
    const bottomClip = top + panelHeight > window.innerHeight;
    if (bottomClip && rect.top - spacing - panelHeight >= 0) {
      top = rect.top - spacing - panelHeight;
    }

    // Clamp horizontally inside viewport
    const minLeft = 8;
    const maxLeft = Math.max(minLeft, window.innerWidth - panelWidth - 8);
    left = Math.min(Math.max(left, minLeft), maxLeft);

    // FIX: use fixed to match rect's viewport coordinates
    panel.style.position = 'fixed';
    panel.style.top = `${Math.round(top)}px`;
    panel.style.left = `${Math.round(left)}px`;
    panel.style.zIndex = '1000';
  };
}
