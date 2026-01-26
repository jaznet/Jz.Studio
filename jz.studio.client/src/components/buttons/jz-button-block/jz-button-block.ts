// jz-button-block.ts

import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { JzButtonBlockFinish, JzButtonBlockRenderService } from "./jz-button-block-render.service";

@Component({
  selector: "jz-button-block",
  standalone: true,
  templateUrl: "./jz-button-block.html",
  styleUrls: ["./jz-button-block.scss"],
})
export class JzButtonBlockComponent implements AfterViewInit, OnDestroy {
  @ViewChild("canvas2d", { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() text = "Button";
  @Input() ariaLabel?: string;

  // ✅ Now supports archetypes (and still accepts legacy matte/anodized/glossy)
  @Input() finish: JzButtonBlockFinish = "bakeliteSatin";
  @Input() baseHex = "#2f3440";

  private unregister?: () => void;

  private hover = false;
  private pressed = false;
  private focus = false;

  constructor(private renderSvc: JzButtonBlockRenderService) { }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;

    this.unregister = this.renderSvc.register({
      canvas2d: canvas,
      getFinish: () => this.finish,
      getBaseHex: () => this.baseHex,
      isActive: () => this.hover || this.pressed || this.focus,
      getT: () => (this.pressed ? 1 : (this.hover || this.focus) ? 0.6 : 0),
    });

    this.renderSvc.snapshot(canvas);
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

  onPointerDown(): void {
    this.pressed = true;
    this.renderSvc.setActiveCanvas(this.canvasRef.nativeElement);
  }

  onPointerUp(): void {
    this.pressed = false;
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
