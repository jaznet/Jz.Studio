// src/components/buttons/jz-button-block/jz-button-block.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { JzButtonBlockRenderService } from "./jz-button-block-render.service";
import { JzButtonBlockFinish } from "./jz-button-block-materials";

@Component({
  selector: "jz-button-block",
  standalone: true,
  templateUrl: "./jz-button-block.html",
  styleUrls: ["./jz-button-block.scss"],
})
export class JzButtonBlockComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild("canvas2d", { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  // DESIGN-TIME SIZE (source of truth for canvas CSS size)
  @Input() width = 100;
  @Input() height = 60;

  @Input() text = "Button";
  @Input() ariaLabel?: string;

  // Archetypes (and legacy matte/anodized/glossy)
  @Input() finish: JzButtonBlockFinish = "bakeliteSatin";
  @Input() baseHex = "#4d554a";

  private unregister?: () => void;

  private hover = false;
  private pressed = false;
  private focus = false;

  constructor(private renderSvc: JzButtonBlockRenderService) { }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    this.unregister = this.renderSvc.register({
      canvas2d: canvas,

      // Finish/color come from inputs
      getFinish: () => this.finish,
      getBaseHex: () => this.baseHex,

      // Activity state
      isActive: () => this.hover || this.pressed || this.focus,
      getT: () => (this.pressed ? 1 : this.hover || this.focus ? 0.6 : 0),
    });

    // Ensure first frame after layout settles (important for clientWidth/clientHeight)
    requestAnimationFrame(() => {
      this.renderSvc.setActiveCanvas(canvas);
      this.renderSvc.snapshot(canvas);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.canvasRef) return;

    const sizeChanged = ("width" in changes) || ("height" in changes);
    const materialChanged = ("finish" in changes) || ("baseHex" in changes);

    if (!sizeChanged && !materialChanged) return;

    const canvas = this.canvasRef.nativeElement;

    // Force service to re-read CSS size and resize backing store
    this.renderSvc.setActiveCanvas(canvas);

    // If idle, render a static snapshot
    if (!this.hover && !this.pressed && !this.focus) {
      this.renderSvc.snapshot(canvas);
    }
  }

  ngOnDestroy(): void {
    this.unregister?.();
  }

  onPointerEnter(): void {
    this.hover = true;
    this.renderSvc.setActiveCanvas(this.canvasRef.nativeElement);
  }

  onPointerLeave(): void {
    this.hover = false;
    this.pressed = false;
    this.renderSvc.maybeReleaseActive(this.canvasRef.nativeElement);
  }

  onPointerDown(ev?: PointerEvent): void {
    this.pressed = true;

    if (ev && ev.pointerId != null) {
      try {
        (ev.currentTarget as HTMLElement | null)?.setPointerCapture?.(ev.pointerId);
      } catch {
        /* ignore */
      }
    }

    this.renderSvc.setActiveCanvas(this.canvasRef.nativeElement);
  }

  onPointerUp(ev?: PointerEvent): void {
    this.pressed = false;

    if (ev && ev.pointerId != null) {
      try {
        (ev.currentTarget as HTMLElement | null)?.releasePointerCapture?.(ev.pointerId);
      } catch {
        /* ignore */
      }
    }

    this.renderSvc.maybeReleaseActive(this.canvasRef.nativeElement);
  }

  onPointerCancel(): void {
    this.pressed = false;
    this.renderSvc.maybeReleaseActive(this.canvasRef.nativeElement);
  }

  onFocusIn(): void {
    this.focus = true;
    this.renderSvc.setActiveCanvas(this.canvasRef.nativeElement);
  }

  onFocusOut(): void {
    this.focus = false;
    this.pressed = false;
    this.renderSvc.maybeReleaseActive(this.canvasRef.nativeElement);
  }
}
