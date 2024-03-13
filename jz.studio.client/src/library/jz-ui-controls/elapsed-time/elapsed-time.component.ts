import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'elapsed-time',
  templateUrl: './elapsed-time.component.html',
  styleUrls: ['./elapsed-time.component.css']
})
export class ElapsedTimeComponent implements OnInit, AfterViewInit {

  time: number = Date.now();
  timer: any;
  seconds: number = 0;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.timer = setInterval(
      () => { ++this.seconds; }, 1000
    );
  }

}
