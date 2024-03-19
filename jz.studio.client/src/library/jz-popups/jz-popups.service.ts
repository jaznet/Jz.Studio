import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JzPopupsService {
  @Output() popUpEvent = new EventEmitter();
  @Output() popoverEvent = new EventEmitter();

  constructor() { }

  showPopupLoading() {
    this.popUpEvent.emit();
  }

  showPopoverLoading() {
    this.popoverEvent.emit();
  }
}
