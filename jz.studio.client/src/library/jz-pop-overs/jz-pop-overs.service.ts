import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JzPopOversService {
  @Output() popoverLoadingEvent = new EventEmitter();

  constructor() { }

  showPopoverLoading(title:string) {
    this.popoverLoadingEvent.emit('show');
  }

  hidePopoverLoading() {
    this.popoverLoadingEvent.emit('hide');
  }
}
