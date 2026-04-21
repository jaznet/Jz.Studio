// panel-preference.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelPreference } from '../interfaces/panel-preference.interface';
import { DEFAULT_PANEL_PREFERENCES } from '../interfaces/technical-analysis-panel-preferences';

@Injectable({
  providedIn: 'root'
})
export class PanelPreferenceService {
  private readonly _preferences = new BehaviorSubject<PanelPreference[]>(
    [...DEFAULT_PANEL_PREFERENCES]
  );

  readonly preferences$ = this._preferences.asObservable();

  getPreferences(): PanelPreference[] {
    return [...this._preferences.value]
      .sort((a, b) => a.order - b.order);
  }

  setPreferences(preferences: PanelPreference[]): void {
    this._preferences.next([...preferences]);
  }

  updatePreference(id: string, patch: Partial<PanelPreference>): void {
    const next = this._preferences.value.map(pref =>
      pref.id === id ? { ...pref, ...patch } : pref
    );

    this._preferences.next(next);
  }

  resetToDefaults(): void {
    this._preferences.next([...DEFAULT_PANEL_PREFERENCES]);
  }
}
