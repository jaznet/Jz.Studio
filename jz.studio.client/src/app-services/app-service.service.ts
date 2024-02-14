import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppServices {

  @Output() toggleMenuEvent = new EventEmitter<string>();

  constructor() { }

  hideMenu() {
    this.toggleMenuEvent.emit('hide');
  }

  showMenu() {
    this.toggleMenuEvent.emit('show');
  }
}
