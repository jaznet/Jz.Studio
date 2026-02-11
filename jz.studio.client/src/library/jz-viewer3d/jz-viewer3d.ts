import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'jz-3d-viewer',
  standalone: true,
  templateUrl: './jz-viewer3d.html',
  styleUrls: ['./jz-viewer3d.scss']
})
export class JzViewer3d implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true })

  canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private frameId = 0;

  // Scene roots
  private rootButton = new THREE.Group();
  private rootMath = new THREE.Group();
  private rootDebug = new THREE.Group();

  // Public accessors
  getButtonRoot() { return this.rootButton; }
  getMathRoot() { return this.rootMath; }
  getDebugRoot() { return this.rootDebug; }

  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      35,
      canvas.clientWidth / canvas.clientHeight,
      0.01,
      100
    );

    this.camera.position.set(3, 2, 4);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);

    // Add roots
    this.scene.add(this.rootButton);
    this.scene.add(this.rootMath);
    this.scene.add(this.rootDebug);

    this.setMode("button");

    // resize observer
    new ResizeObserver(() => this.onResize()).observe(canvas);
  }

  setMode(mode: "button" | "math") {
    this.rootButton.visible = mode === "button";
    this.rootMath.visible = mode === "math";
  }

  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private onResize() {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
  }
}
