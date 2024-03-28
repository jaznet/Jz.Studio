
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.css'
})
export class DashboardViewComponent implements OnInit, AfterViewInit {

  constructor() {

  }
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
