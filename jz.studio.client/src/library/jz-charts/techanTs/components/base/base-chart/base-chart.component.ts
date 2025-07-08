
import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { scaffold } from '../../../interfaces/techan-interfaces';

@Component({
  selector: 'base-chart',
  templateUrl: './base-chart.component.html',
  styleUrls: ['./base-chart.component.scss']
})
export class BaseChartComponent implements AfterViewInit {
  @Input() scaffold!: scaffold;

  @ViewChild('gChart') gChartRef!: ElementRef<SVGGElement>;

  ngAfterViewInit(): void {
    // You can emit viewReady if needed via Output
  }

  public getChartGroup(): SVGGElement {
    return this.gChartRef.nativeElement;
  }
}
