
import { Component, ElementRef, HostBinding, Input, Renderer2, ViewChild } from '@angular/core';
import { AppMgrService } from '../../../app/app-services/app-mgr.service';
import { PaletteMgrService } from '../../../app/app-services/palette-mgr.service';

@Component({
  selector: 'jz-radio-button',
  templateUrl: './jz-radio-button.component.html',
  styleUrls: ['./jz-radio-button.component.css']
})
export class JzRadioButtonComponent {
  @HostBinding('class') classes = 'palette-menu-container';
  @Input() palette: string = 'gunmetal';
  @Input() btncolor: string = '#172626';
  @Input() stroke: string = 'red';
  @ViewChild('circle', { static: false }) circle: ElementRef | undefined;

  constructor(
    private appMgr: AppMgrService,
    private paletteMgr:PaletteMgrService,
    private renderer: Renderer2) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    const fill = this.btncolor;
    this.renderer.setAttribute(this.circle?.nativeElement, 'fill', fill);
  }

  setPalette() {
    console.log(this.palette);
    this.paletteMgr.ChangePalette(this.palette);
  }
}
