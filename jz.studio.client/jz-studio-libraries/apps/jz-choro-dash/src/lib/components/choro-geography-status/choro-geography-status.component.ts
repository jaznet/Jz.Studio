import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'choro-geography-status',
  standalone: true,
  template: `
    @if (error) {
      <div role="alert">
        <p>{{ error }}</p>
        <button type="button" (click)="retryRequested.emit()">Retry</button>
      </div>
    } @else {
      <p role="status">Loading map geography…</p>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ChoroGeographyStatusComponent {
  @Input() error?: string;
  @Output() readonly retryRequested = new EventEmitter<void>();
}

