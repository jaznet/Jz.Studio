import { EventEmitter, Injectable, Output } from '@angular/core';
import { PopOverLoadingParams } from './interfaces/popoverloadingparams';

@Injectable({
  providedIn: 'root'
})
export class JzPopOversService {
  @Output() popoverLoadingEvent = new EventEmitter();

  constructor() { }

  showPopoverLoading(params: PopOverLoadingParams) {
    /* this.popoverLoadingEvent.emit('show');*/
    params.action = 'show';
    this.popoverLoadingEvent.emit(params);
  }

  hidePopoverLoading(params: PopOverLoadingParams) {
    params.action = 'hide'
    this.popoverLoadingEvent.emit(params);
  }
}
