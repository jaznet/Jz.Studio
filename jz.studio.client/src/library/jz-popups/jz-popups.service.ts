import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JzPopupsService {
  @Output() popEvent = new EventEmitter();
  constructor() { }

  showPopupLoading() {
    this.popEvent.emit();
  }
}
