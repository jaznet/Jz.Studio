import { EventEmitter, Injectable, Output } from '@angular/core';
import { PopOverLoadingParams } from './interfaces/popoverloadingparams';

@Injectable({
  providedIn: 'root'
})
export class JzPopOversService {
  @Output() popoverLoadingEvent = new EventEmitter();

  constructor() { }

  togglePopOverLoading(params: PopOverLoadingParams) {
    this.popoverLoadingEvent.emit(params);
  }

  //hidePopOverLoading(params: PopOverLoadingParams) {
  //  params.action = 'hide'
  //  this.popoverLoadingEvent.emit(params);
  //}
}
