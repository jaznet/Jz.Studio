
import { AfterViewInit, Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.css'
})
export class DashboardViewComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent ';

  cellSpacing : number[] = [10, 10];
  public panels: any = [{ "sizeX": 1, "sizeY": 1, "row": 0, "col": 0, content: '<div class="content">0</div>' },
  { "sizeX": 3, "sizeY": 2, "row": 0, "col": 1, content: '<div class="content">1</div>' },
  { "sizeX": 1, "sizeY": 3, "row": 0, "col": 4, content: '<div class="content">2</div>' },
  { "sizeX": 1, "sizeY": 1, "row": 1, "col": 0, content: '<div class="content">3</div>' },
  { "sizeX": 2, "sizeY": 1, "row": 2, "col": 0, content: '<div class="content">4</div>' },
  { "sizeX": 1, "sizeY": 1, "row": 2, "col": 2, content: '<div class="content">5</div>' },
  { "sizeX": 1, "sizeY": 1, "row": 2, "col": 3, content: '<div class="content">6</div>' }
  ]
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    let element = document.getElementById("app-body");
    console.log("Element found:", element);
    let divChild = element?.querySelector(":scope > div");
    if (divChild instanceof HTMLElement)
      divChild!.style.visibility = 'hidden';
    console.log("Element found:", divChild);
  }

}

