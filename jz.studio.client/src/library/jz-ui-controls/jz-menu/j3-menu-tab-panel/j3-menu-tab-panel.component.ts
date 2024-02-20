import { AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'j3-menu-tab-panel',
  templateUrl: './j3-menu-tab-panel.component.html',
  styleUrls: ['./j3-menu-tab-panel.component.css']
})
export class MenuTabPanelComponent implements OnInit, AfterViewInit {

  @HostBinding('class') classes = 'flex';
  @Input() orientation: string = 'default';

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(this.orientation); 
  }

}
