import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'choro-dash-load-status',
  standalone: true,
  template: `
    @if (empty) {
      <div role="status">
        <p>{{ empty }}</p>
        <button type="button" (click)="retryRequested.emit()">Retry</button>
      </div>
    } @else if (error) {
      <div role="alert">
        <p>{{ error }}</p>
        <button type="button" (click)="retryRequested.emit()">Retry</button>
      </div>
    } @else {
      <p role="status">Loading county median ages…</p>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ChoroDashLoadStatusComponent {
  @Input() empty?: string;
  @Input() error?: string;

  @Output() readonly retryRequested = new EventEmitter<void>();
}
