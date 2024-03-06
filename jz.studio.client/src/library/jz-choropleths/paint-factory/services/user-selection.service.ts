import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserSelectionService {
  private _currentSelection: string;

  constructor() {
    // Initialize with a default value if necessary
    this._currentSelection = 'default';
  }

  // Method to update the current selection
  setSelection(selection: string) {
    this._currentSelection = selection;
  }

  // Method to retrieve the current selection
  getSelection(): string {
    return this._currentSelection;
  }
}
