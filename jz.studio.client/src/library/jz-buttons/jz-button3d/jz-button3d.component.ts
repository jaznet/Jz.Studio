
import { AfterViewChecked, AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jz-button3d',
  templateUrl: './jz-button3d.component.html',
  styleUrl: './jz-button3d.component.css'
})
export class JzButton3dComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('class') classes = 'fit-to-parent';

  @Input() height: number = 33;
  @Input() width: number = 100;
  @Input() text: string = 'Enter3D';
  @Input() background: string = 'orange';
  @Input() menuType!: string;
  @Input() isSelected: boolean = false;

  height_px: string = '0px';
  width_px: string = '0px';
  border_px: string = '0px';
 
  isSubMenu: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.height_px = this.height + 'px';
    this.width_px = this.width + 'px';
    this.border_px = .175 * this.height + 'px';
  //  console.log(this.menuType);
    if (this.menuType === 'sub-menu')
      this.isSubMenu = true;
    else
      this.isSubMenu = false;
    //   this.color = this.colorTxt;
    //this.background = this.btnBackground;
    //this.changeDetector.detectChanges();
  }
  ngAfterViewChecked(): void {
   
  }
}
