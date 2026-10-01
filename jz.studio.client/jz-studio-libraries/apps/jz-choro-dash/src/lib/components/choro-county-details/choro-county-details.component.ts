import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'choro-county-details',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div>{{ countyName }}, {{ stateName }}</div>
    <div>
      {{ metricLabel }}:
      @if (metricValue !== undefined) {
        {{ metricValue | number:'1.0-1' }}
      } @else {
        Not available
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ChoroCountyDetailsComponent {
  @Input() countyName = '';
  @Input() stateName = '';
  @Input() metricLabel = 'Value';
  @Input() metricValue?: number;
}

