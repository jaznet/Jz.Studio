import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSelectionService {
  private _currentSelection: string;

  constructor() {
    this._currentSelection = 'default';
  }

  setSelection(selection: string) {
    this._currentSelection = selection;
  }

  getSelection(): string {
    return this._currentSelection;
  }
}
