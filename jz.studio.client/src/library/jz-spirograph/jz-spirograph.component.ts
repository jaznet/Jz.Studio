import { AfterContentInit, AfterViewInit, Component, ElementRef, HostBinding, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Spiro } from './spiro';
import array_store from 'devextreme/data/array_store';
import { SpirographService } from './spirograph.service';

@Component({
  selector: 'jz-spirograph',
  templateUrl: './jz-spirograph.component.html',
  styleUrl: './jz-spirograph.component.css'
})
export class JzSpirographComponent implements OnInit, AfterViewInit, AfterContentInit {

  @HostBinding('class') classes = 'fit-to-parent';

  //#region    Properties

  @ViewChild('sidepanel', { static: true }) sidepanel: ElementRef | undefined;
  @ViewChild('pad', { static: true }) pad: ElementRef | undefined;
  @ViewChild('canvasGrid', { static: true }) ref_canvasGrid: ElementRef | undefined;
  @ViewChild('canvasCircles', { static: true }) ref_canvasCircles: ElementRef | undefined;
  @ViewChild('canvasPen', { static: true }) ref_canvasPen: ElementRef | undefined;
  @ViewChild('presets', { static: true }) ref_presets: ElementRef | undefined;
  @ViewChild('stator', { static: true }) ref_stator: ElementRef | undefined;
  @ViewChild('rotors', { static: true }) ref_rotors: ElementRef | undefined;
  @ViewChild('rotor1', { static: true }) ref_rotor1: ElementRef | undefined;
  @ViewChild('rotor2', { static: true }) ref_rotor2: ElementRef | undefined;
  @ViewChild('rotor3', { static: true }) ref_rotor3: ElementRef | undefined;
  @ViewChild('rotor4', { static: true }) ref_rotor4: ElementRef | undefined;
  @ViewChild('rotor5', { static: true }) ref_rotor5: ElementRef | undefined;
  @ViewChild('radius1', { static: true }) ref_radius1: ElementRef | undefined;
  @ViewChild('radius2', { static: true }) ref_radius2: ElementRef | undefined;
  @ViewChild('radius3', { static: true }) ref_radius3: ElementRef | undefined;
  @ViewChild('radius4', { static: true }) ref_radius4: ElementRef | undefined;
  @ViewChild('radius5', { static: true }) ref_radius5: ElementRef | undefined;
  @ViewChild('hypo1', { static: true }) ref_hypo1: ElementRef | undefined;
  @ViewChild('hypo2', { static: true }) ref_hypo2: ElementRef | undefined;
  @ViewChild('hypo3', { static: true }) ref_hypo3: ElementRef | undefined;
  @ViewChild('hypo4', { static: true }) ref_hypo4: ElementRef | undefined;
  @ViewChild('hypo5', { static: true }) ref_hypo5: ElementRef | undefined;
  @ViewChild('epi1', { static: true }) ref_epi1: ElementRef | undefined;
  @ViewChild('epi2', { static: true }) ref_epi2: ElementRef | undefined;
  @ViewChild('epi3', { static: true }) ref_epi3: ElementRef | undefined;
  @ViewChild('epi4', { static: true }) ref_epi4: ElementRef | undefined;
  @ViewChild('epi5', { static: true }) ref_epi5: ElementRef | undefined;
  @ViewChild('penr', { static: true }) ref_penr: ElementRef | undefined;
  @ViewChild('penw', { static: true }) ref_penw: ElementRef | undefined;
  @ViewChild('penc', { static: true }) ref_penc: ElementRef | undefined;
  @ViewChild('drawButton', { static: true }) ref_drawButton: ElementRef | undefined;


  dataSource: array_store<Spiro, any>;
  selectedValue: string = "display";
  padDiv: HTMLDivElement | undefined;
  canvasGrid: HTMLCanvasElement | undefined;
  canvasCircles: HTMLCanvasElement | undefined;
  canvasPen: HTMLCanvasElement | undefined;
  presets: any;
  rotors: HTMLDivElement | undefined;
  stator: HTMLInputElement | undefined;
  rotorElems: Array<HTMLDivElement> = new Array<HTMLDivElement>();
  radiusElems: Array<HTMLInputElement> = new Array<HTMLInputElement>();
  hypoElems: Array<HTMLInputElement> = new Array<HTMLInputElement>();
  epiElems: Array<HTMLInputElement> = new Array<HTMLInputElement>();
  penr: HTMLInputElement | undefined;
  penw: HTMLInputElement | undefined;
  penc: HTMLInputElement | undefined;
  drawButton: HTMLButtonElement | undefined;

  //ctxCanvasCircles: CanvasRenderingContext2D | undefined;
  //ctxCanvasPen: CanvasRenderingContext2D | undefined;
  ctxCanvasCircles: any;
  ctxCanvasPen: any;
  canvasOrigin: { x: number, y: number } = { x: 0, y: 0 };

  radii: Array<number> = Array<number>();
  types: Array<string> = Array<string>();
  directions: Array<number> = Array<number>();
  drawPitches: Array<number> = Array<number>();
  spinPitches: Array<number> = Array<number>();

  rotorVals: Array<{ radius: number, type: string }> = new Array<{ radius: number, type: string }>();
  circleColor: string = "#7286a0";
  curveColor: string = '#808080';
  penColor: string = 'yellow';
  curveWidth: number = 1;
  penRad: number | undefined;
  penStart: { x: number, y: number } | undefined;
  speed: number | undefined;
  iOffset: number | undefined;
  pitches: [number] = [1];
  drawIteration: number = 0;
  paused: boolean = false;
  drawing: boolean = false;

  curvePoints: Array<{ x: number, y: number }> = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

  //#endregion

  constructor(private service: SpirographService, private renderer: Renderer2) {
    this.dataSource = service.listDataSource;
  }


  ngOnInit() {
    let that = this;
    let select = this.ref_presets!.nativeElement;
    this.service.presets!.forEach(function (value: Spiro) {
      let option = that.renderer.createElement('option');
      that.renderer.appendChild(select, option);
      that.renderer.setAttribute(option, 'value', value.name);
      that.renderer.setAttribute(option, 'label', value.name);
    });
    this.dataSource = this.service.listDataSource;
    this.selectedValue = "pick one";
    window.onresize = function (e) {
      that.resizeCanvas();
    };
  }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {
    this.stator = this.ref_stator!.nativeElement;
    this.rotorElems[1] = this.ref_rotor1!.nativeElement;
    this.rotorElems[2] = this.ref_rotor2!.nativeElement;
    this.rotorElems[3] = this.ref_rotor3!.nativeElement;
    this.rotorElems[4] = this.ref_rotor4!.nativeElement;
    this.rotorElems[5] = this.ref_rotor5!.nativeElement;
    this.radiusElems[1] = this.ref_radius1!.nativeElement;
    this.radiusElems[2] = this.ref_radius2!.nativeElement;
    this.radiusElems[3] = this.ref_radius3!.nativeElement;
    this.radiusElems[4] = this.ref_radius4!.nativeElement;
    this.radiusElems[5] = this.ref_radius5!.nativeElement;
    this.hypoElems[1] = this.ref_hypo1!.nativeElement;
    this.hypoElems[2] = this.ref_hypo2!.nativeElement;
    this.hypoElems[3] = this.ref_hypo3!.nativeElement;
    this.hypoElems[4] = this.ref_hypo4!.nativeElement;
    this.hypoElems[5] = this.ref_hypo5!.nativeElement;
    this.epiElems[1] = this.ref_epi1!.nativeElement;
    this.epiElems[2] = this.ref_epi2!.nativeElement;
    this.epiElems[3] = this.ref_epi3!.nativeElement;
    this.epiElems[4] = this.ref_epi4!.nativeElement;
    this.epiElems[5] = this.ref_epi5!.nativeElement;
    this.penr = this.ref_penr!.nativeElement;
    this.penw = this.ref_penw!.nativeElement;
    this.penc = this.ref_penc!.nativeElement;
    this.drawButton = this.ref_drawButton!.nativeElement;

    this.presets = this.ref_presets!.nativeElement;
    this.presets!.value = 'alien artifact';
    this.rotors = this.ref_rotors!.nativeElement;

    this.padDiv = this.pad!.nativeElement;
    this.canvasGrid = this.ref_canvasGrid!.nativeElement;
    this.canvasCircles = this.ref_canvasCircles!.nativeElement;
    this.canvasPen = this.ref_canvasPen!.nativeElement;
    this.ctxCanvasCircles = this.canvasCircles!.getContext('2d');
    this.ctxCanvasPen = this.canvasPen!.getContext('2d');
    this.penRad = Number(this.penr!.value);

    this.loadPresets('alien artifact');
    this.loadValues('alien artifact');
    this.setValues();
    this.drawCanvas();
    this.drawCircles();
  }

  resizeCanvas() {
    console.log('resizeCanvas()');
    console.log(' pad size', this.padDiv!!.clientHeight, this.padDiv!.clientWidth);
    this.renderer.setAttribute(this.canvasGrid, 'width', this.padDiv!.clientWidth.toString());
    this.renderer.setAttribute(this.canvasGrid, 'height', this.padDiv!.clientHeight.toString());
    this.renderer.setAttribute(this.canvasCircles, 'width', this.padDiv!.clientWidth.toString());
    this.renderer.setAttribute(this.canvasCircles, 'height', this.padDiv!.clientHeight.toString());
    this.renderer.setAttribute(this.canvasPen, 'width', this.padDiv!.clientWidth.toString());
    this.renderer.setAttribute(this.canvasPen, 'height', this.padDiv!.clientHeight.toString());
    this.canvasOrigin = { x: this.padDiv!.clientWidth / 2, y: this.padDiv!.clientHeight / 2 };
    console.log(' origin', this.canvasOrigin);
    console.log(' penStart', this.penStart);
  }

  drawCanvas() {
    console.log('drawCanvas()');
    this.resizeCanvas();
  }

  parseRotorValues(i: number, r: string) {
    if (r != '') {
      this.rotorVals[i] = { radius: Number(r.substr(0, r.length - 1)), type: r.substring(r.length - 1) }
    }
    else {
      this.rotorVals[i] = { radius: 0, type: 'x' }
    }
  }

  loadPresets(preset: string) {
    console.groupCollapsed('%cloadPresets() maya code', 'color:#69B578', this.service.presetDict.Item(preset));

    let values: Spiro = this.service.presetDict.Item(preset);

    let stator = values.st;
    this.stator!.value = stator;
    this.rotorVals[0] = { radius: 0, type: 'x' };

    this.parseRotorValues(1, values.r1);
    this.parseRotorValues(2, values.r2);
    this.parseRotorValues(3, values.r3);
    this.parseRotorValues(4, values.r4);
    this.parseRotorValues(5, values.r5);

    console.log(' rotorVals', this.rotorVals);

    for (let i = 1; i <= 5; i++) {
      if (this.rotorVals[i].type === 'x') {
        this.renderer.setAttribute(this.rotorElems[i], 'style', 'display:none');
      }
      else {
        this.radiusElems[i].value = this.rotorVals[i].radius.toString();
        if (this.rotorVals[i].type === 'h') {
          this.renderer.setAttribute(this.hypoElems[i], 'checked', 'true');
        }
        else {
          this.renderer.setAttribute(this.epiElems[i], 'checked', 'true');
        }
      }
    }

    this.penr!.value = values.pen;
    this.penw!.value = values.wd;
    this.penc!.value = values.cl;
    console.groupEnd();
  }

  setValues() {
    console.groupCollapsed('%csetValues()', 'color:#69B578');
    console.log(' stator:', this.stator!.value);
    let d = this.drawPitches;
    let s = this.spinPitches;
    console.log(' drawPitches', d);
    console.log(' spinPitches', s);

    let testSpin = [];
    let testDraw = [];

    this.radii[0] = Number(this.stator!.value);
    // this.drawPitches[0] = 0;
    // this.spinPitches[0] = 1;


    for (let i = 1; i <= 5; i++) {
      this.radii[i] = Number(this.radiusElems[i].value);

      if (this.hypoElems[i].checked === true) {
        this.types[i] = 'h';
        if (i === 1) {
          this.directions = [1, 1];
          this.drawPitches[i] = 1;
          this.spinPitches[i] = (this.radii[i - 1] / this.rotorVals[i].radius) - 1;
          testDraw.push(1);
          testSpin.push((this.radii[i - 1] / this.rotorVals[i].radius) - 1);
        }
        else {
          this.drawPitches[i] = this.spinPitches[i - 1];
          this.spinPitches[i] = (this.radii[i - 1] / this.rotorVals[i].radius) - 1;
          testDraw.push(testSpin[i - 2]);
          testSpin.push((this.radii[i - 1] / this.rotorVals[i].radius) - 1);
        }
      }

      else if (this.epiElems[i].checked === true) {
        this.types[i] = 'e';
        if (i === 1) {
          this.directions = [1, 1];
          this.drawPitches[i] = 1;
          this.spinPitches[i] = (this.radii[i - 1] / this.rotorVals[i].radius) + 1;
          testDraw.push(1);
          testSpin.push((this.radii[i - 1] / this.rotorVals[i].radius) + 1);
        }
        else {
          this.drawPitches[i] = this.spinPitches[i - 1];
          this.spinPitches[i] = (this.radii[i - 1] / this.rotorVals[i].radius) + 1;
          testDraw.push(testSpin[i - 2]);
          testSpin.push((this.radii[i - 1] / this.rotorVals[i].radius) + 1);
        }
      }

      else {
        this.types[i] = 'x';
      }
    }

    console.log(' radii', this.radii);
    console.log(' types', this.types);
    console.log(' drawPitches', this.drawPitches);
    console.log(' spinPitches', this.spinPitches);
    console.log(' directions', this.directions);
    console.log(' testSpin', testSpin);
    console.log(' testDraw', testDraw);
    console.groupCollapsed();
  }

  circlePoint(i: any, a: any, b: any, r: any, ng: any) {
    console.log('  ', i, ' a: circlePoint() a,b,r,ng', a, b, r, ng);
    var rad = ng * (Math.PI / 180);
    var y = r * Math.sin(rad);
    var x = r * Math.cos(rad);
    x = a + x;
    y = b - y;
    console.log('  ', i, ' b: circlePoint() rad,x,y', rad, x, y);
    return {
      "x": x,
      "y": y
    }
  }

  drawOneCircle(c: number, canvas: any, a: any, b: any, r: any, fill: any) {
    console.log('  ' + c + ' draw one circle', a, b, r);

    this.ctxCanvasCircles!.beginPath();
    this.ctxCanvasCircles!.arc(a, b, r, 0, 2 * Math.PI);
    this.ctxCanvasCircles!.strokeStyle = 'red';
    if (fill) {
      this.ctxCanvasCircles!.fillStyle = this.curveColor;
      this.ctxCanvasCircles!.fill();
      this.ctxCanvasCircles!.strokeStyle = this.curveColor;
    }
    this.ctxCanvasCircles!.stroke();
    this.ctxCanvasCircles!.closePath();
  }

  drawCircles() {
    let rotorCount = 0;
    let centerRad = 0;
    let thisRad = 0;
    let prevRad = 0;
    let thisPitch = 0;
    let prevPitch = 0;
    let prevSpinPitch = 0;
    let prevDrawPitch = 0;
    let ii = this.drawIteration;
    let penPitch = 0;

    //console.log('wxh', this.canvasCircles.width, this.canvasCircles.height);
    //console.group('Draw Circles');
    //console.groupCollapsed('Draw Circles', this.drawIteration);
    //console.log('draw circles');

    this.ctxCanvasCircles!.clearRect(0, 0, this.canvasCircles!.width, this.canvasCircles!.height);
    this.drawOneCircle(0, this.canvasCircles, this.canvasOrigin.x, this.canvasOrigin.y, this.radii[0], null);

    let pt = { x: this.canvasOrigin.x, y: this.canvasOrigin.y };

    for (let i = 1; i <= 5; i++) {
      if (this.types[i] != 'x') {
        rotorCount++;
        console.log(i, 'Draw Rotor Circle ------------');
        thisRad = this.radii[i];
        prevRad = this.radii[i - 1];

        console.log(' ', i, 'thisRad', thisRad, 'prevRad', prevRad);

        if (this.rotorVals[i].type === "h") {
          //hypitrochoid: circle inside     
          centerRad = prevRad - thisRad;
        } else {
          //eptrochoid: circle outside  
          centerRad = prevRad + thisRad;
        }

        console.log(' ', i, 'centerRad', centerRad);

        //pitches are cumulative, so extract previous from array.    
        if (i > 1) {
          prevPitch = prevPitch + this.pitches[i - 1];
          prevSpinPitch = prevSpinPitch + this.spinPitches[i - 1];
          prevDrawPitch = prevDrawPitch + this.drawPitches[i - 1];
        } else {
          prevPitch = 0;
          prevSpinPitch = 0;
          prevDrawPitch = 0;
        }

        thisPitch = this.drawPitches[i] + prevDrawPitch;
        console.log(' ', i, 'thisPitch', thisPitch, 'prevPitch', prevPitch);
        console.log(' ', i, 'prevSpinPitch', prevSpinPitch, 'prevDrawPitch', prevDrawPitch);

        pt = this.circlePoint(i, pt.x, pt.y, centerRad, ii * thisPitch);

        if (this.rotorVals[i].type != 'x') {
          //console.log('  draw circle', i);
          this.drawOneCircle(i, this.canvasCircles, pt.x, pt.y, thisRad, null);
        }

        if (this.types[i] === "h") {
          penPitch = (this.spinPitches[i] + prevSpinPitch) * -1;
        } else {
          penPitch = (this.spinPitches[i] + prevSpinPitch);
        }

        let penPt = this.circlePoint(i, pt.x, pt.y, thisRad, this.drawIteration * penPitch);

        console.log(' ', i, 'penPitch', penPitch);
        console.log(' ', i, 'pt', pt, 'penPt', penPt);
        //// Pen
        //var ctx = this.canvasCircles.getContext("2d");
        this.ctxCanvasCircles!.lineWidth = 1;
        this.ctxCanvasCircles!.strokeStyle = '#ffffff';
        this.ctxCanvasCircles!.beginPath();
        this.ctxCanvasCircles!.moveTo(pt.x, pt.y);
        this.ctxCanvasCircles!.lineTo(penPt.x, penPt.y);
        this.ctxCanvasCircles!.stroke();
        this.ctxCanvasCircles!.closePath();
      }
    }

    //draw Pen
    //pen pitch set in last circle iteration
    var penPt = this.circlePoint(rotorCount + 1, pt.x, pt.y, this.penRad, this.drawIteration * penPitch);
    this.penStart = penPt;

    this.ctxCanvasCircles!.lineWidth = .2;
    this.ctxCanvasCircles!.strokeStyle = this.circleColor;
    this.ctxCanvasCircles!.beginPath();
    this.ctxCanvasCircles!.moveTo(pt.x, pt.y);
    this.ctxCanvasCircles!.lineTo(penPt.x, penPt.y);
    this.ctxCanvasCircles!.stroke();
    this.ctxCanvasCircles!.closePath();

    //circle for pen Point                                                             
    this.drawOneCircle(rotorCount + 1, this.canvasCircles, penPt.x, penPt.y, 5, true);

    //update curve points for drawCurve() 
    //only maintain previous point, so we'll always plot previous to current. 
    this.curvePoints.push(penPt);
    if (this.curvePoints.length > 2) {
      this.curvePoints.shift();
    }
    // console.log('curvePoints', this.curvePoints);
    // console.groupEnd();
  }

  drawCurve() {
    console.log('drawCurve', this.ctxCanvasPen, this.curvePoints);
    if (this.drawIteration > 1) {
      this.ctxCanvasPen!.beginPath();
      this.ctxCanvasPen!.strokeStyle = this.curveColor;
      this.ctxCanvasPen!.lineWidth = this.curveWidth;
      this.ctxCanvasPen!.moveTo(this.curvePoints[0].x, this.curvePoints[0].y);
      this.ctxCanvasPen!.lineTo(this.curvePoints[1].x, this.curvePoints[1].y);
      this.ctxCanvasPen!.stroke();
      this.ctxCanvasPen!.closePath();
    }
  }

  draw() {
    this.drawIteration++;
    this.drawCircles();
    this.drawCurve();
    requestAnimationFrame(this.draw.bind(this));
  }

  drawClick(event: any) {
    console.log('draw click', event, this.drawIteration);
    // this.testCount++;
    if (!this.drawing && !this.paused) {
      this.drawing = true;
      this.drawIteration = 0;
      this.drawButton!.innerHTML = 'pause';
      this.setValues();
    }
    if (this.drawing && !this.paused) {
      this.paused = true;
      this.drawButton!.innerHTML = 'restart';
      return;
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  presetSelected(event: any) {
    console.log('select', event);
    console.log(' selected item', this.presets!.value);
    console.log(' selected item', this.presets!.selectedIndex);
    this.loadPresets(this.presets!.value);
  }

  loadValues(name: string) {
    console.groupCollapsed('%cLoad Values', 'color:#69B578', name);
    console.log(' selected item', this.presets!.value);
    console.log(' selected item', this.presets!.selectedIndex);
    console.groupCollapsed();
  }

}
