// jz-button-block.ts

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
import {

  JzButtonBlockRenderService,
} from "./jz-button-block-render.service";
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

  @Input() text = "Button";
  @Input() ariaLabel?: string;

  // Archetypes (and legacy matte/anodized/glossy)
  @Input() finish: JzButtonBlockFinish = "bakeliteSatin";
  @Input() baseHex = "#553d36";

  private unregister?: () => void;

  private hover = false;
  private pressed = false;
  private focus = false;

  constructor(private renderSvc: JzButtonBlockRenderService) { }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    this.unregister = this.renderSvc.register({
      canvas2d: canvas,

      // ✅ These must read from the component inputs
      getFinish: () => this.finish,
      getBaseHex: () => this.baseHex,

      isActive: () => this.hover || this.pressed || this.focus,
      getT: () => (this.pressed ? 1 : this.hover || this.focus ? 0.6 : 0),
    });

    // Initial frame
    this.renderSvc.snapshot(canvas);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If inputs change while NOT actively animating, refresh the static snapshot.
    // (During hover/focus/press the RAF loop will pick up the new values automatically.)
    if (!this.canvasRef) return;
    if (!("finish" in changes) && !("baseHex" in changes)) return;

    const canvas = this.canvasRef.nativeElement;
    if (!this.hover && !this.pressed && !this.focus) {
      this.renderSvc.snapshot(canvas);
    } else {
      this.renderSvc.setActiveCanvas(canvas);
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

    // Helps keep “pressed” stable if pointer drifts off the element.
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
