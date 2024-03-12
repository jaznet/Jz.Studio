import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'jz-choro-dash',
  templateUrl: './jz-choro-dash.component.html',
  styleUrl: './jz-choro-dash.component.css'
})
export class JzChoroDashComponent implements OnInit {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor() { }

    ngOnInit(): void {
       
    }
}
