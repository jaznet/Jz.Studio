import { AfterViewInit, Component, ElementRef, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'jz-choro-dash',
  templateUrl: './jz-choro-dash.component.html',
  styleUrl: './jz-choro-dash.component.css'
})
export class JzChoroDashComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor(private element: ElementRef) {
    console.log(this.element.nativeElement.clientWidth, this.element.nativeElement.clientHeight);
  }
    ngAfterViewInit(): void {
      console.log(this.element.nativeElement.clientWidth, this.element.nativeElement.clientHeight);
    }

    ngOnInit(): void {
      console.log(this.element.nativeElement.clientWidth, this.element.nativeElement.clientHeight);
    }
}
