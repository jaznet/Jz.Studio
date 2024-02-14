import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppEventsService {

  @Output() setPaletteEvent = new EventEmitter<{ menu: string; item: string }>();
  @Output() popEvent = new EventEmitter();
  @Output() viewSelectedEvent = new EventEmitter();

  constructor() { }

  setPalette(menu: string, item: string) {
    this.setPaletteEvent.emit({ menu: menu, item: item });
  }

  ShowPopup(popup: string) {
    this.popEvent.emit(popup)
  }

  SelectView(view: string) {
    this.viewSelectedEvent.emit(view);
  }
}
