
import { Component } from '@angular/core';

@Component({
  selector: 'day-of-week',
  templateUrl: './day-of-week.component.html',
  styleUrls: ['./day-of-week.component.css']
})
export class DayOfWeekComponent {
  dayOfWeek: string;

  constructor() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDate = new Date();
    this.dayOfWeek = days[currentDate.getDay()];
  }


}
