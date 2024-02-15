import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppServices {

  @Output() toggleHeaderEvent = new EventEmitter<string>();
  @Output() toggleMenuEvent = new EventEmitter<string>();

  constructor() { }

  hideHeader() {
    this.toggleHeaderEvent.emit('hide');
  }

  showHeader() {
    this.toggleHeaderEvent.emit('show');
  }

  hideMenu() {
    this.toggleMenuEvent.emit('hide');
  }

  showMenu() {
    this.toggleMenuEvent.emit('show');
  }
}
