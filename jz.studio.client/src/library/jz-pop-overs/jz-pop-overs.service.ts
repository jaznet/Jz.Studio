import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JzPopOversService {
  @Output() popoverEvent = new EventEmitter();

  constructor() { }

  showPopoverLoading() {
    this.popoverEvent.emit();
  }
}
