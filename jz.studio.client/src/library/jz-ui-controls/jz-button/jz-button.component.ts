
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jz-button',
  templateUrl: './jz-button.component.html',
  styleUrls: ['./jz-button.component.css']
})
export class JzButtonComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('class') classes = 'fit-to-content';
  @Input() text: string = 'Enter';
  @Input() height: number = 33;
  @Input() width: number = 100;
  @Input() colorTxt: string = 'var(--plt-clr-5)';
  @Input() colorBkg: string = 'var(--plt-clr-1)';
  @Input() fontSize: string = '14px';

  height_px:string = '0px';
  width_px: string = '0px';
  border_px: string = '0px';
  color!: string;
  background!:string;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private element: ElementRef) {   
  } 
   
  ngOnInit(): void {  }

  ngAfterViewInit(): void {
    this.height_px = this.height + 'px';
    this.width_px = this.width + 'px';
    this.border_px = .175 * this.height + 'px';
    this.color = this.colorTxt;
    this.background = this.colorBkg;
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  } 

  onClicked() {
    console.log(this.element);
  }

}
