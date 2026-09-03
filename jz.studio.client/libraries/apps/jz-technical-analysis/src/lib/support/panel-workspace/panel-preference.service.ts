// panel-preference.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PanelPreference } from '../../interfaces/panel-preference.interface';
import { DEFAULT_PANEL_PREFERENCES } from '../../technical-analysis-panel-preferences';
import { ChartType } from '../../enums/chart-type';

@Injectable({
  providedIn: 'root'
})
export class PanelPreferenceService {
  private readonly storageKey = 'jz.technical-analysis.panel-slots.v1';
  private readonly legacyVisibilityKey = 'jz.technical-analysis.panel-visibility.v1';
  private readonly _preferences = new BehaviorSubject<PanelPreference[]>(
    this.loadPreferences()
  );

  readonly preferences$ = this._preferences.asObservable();

  getPreferences(): PanelPreference[] {
    return [...this._preferences.value]
      .sort((a, b) => a.order - b.order);
  }

  setPreferences(preferences: PanelPreference[]): void {
    const next = preferences.map(preference => ({
      ...preference,
      visible: preference.chartType === ChartType.OHLC ? true : preference.visible
    }));
    this._preferences.next(next);
    this.persistVisibility(next);
  }

  updatePreference(id: string, patch: Partial<PanelPreference>): void {
    const next = this._preferences.value.map(pref =>
      pref.id === id ? { ...pref, ...patch } : pref
    );

    this.setPreferences(next);
  }

  assignIndicator(slotId: string, chartType: ChartType): void {
    const preferences = this._preferences.value;
    const target = preferences.find(preference => preference.id === slotId);
    if (!target || target.chartType === ChartType.OHLC || target.chartType === chartType) {
      return;
    }

    const occupied = preferences.find(preference => preference.chartType === chartType);
    const next = preferences.map(preference => {
      if (preference.id === slotId) {
        return { ...preference, chartType };
      }
      if (occupied && preference.id === occupied.id) {
        return { ...preference, chartType: target.chartType };
      }
      return preference;
    });

    this.setPreferences(next);
  }

  resetToDefaults(): void {
    this.setPreferences([...DEFAULT_PANEL_PREFERENCES]);
  }

  hasHiddenIndicators(): boolean {
    return this._preferences.value.some(preference =>
      preference.chartType !== ChartType.OHLC && !preference.visible
    );
  }

  restoreIndicatorVisibility(): void {
    this.setPreferences(this._preferences.value.map(preference => ({
      ...preference,
      visible: true
    })));
  }

  private loadPreferences(): PanelPreference[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return this.loadLegacyVisibility();

      const saved = JSON.parse(stored) as Record<string, {
        chartType?: ChartType;
        visible?: boolean;
      }>;
      return DEFAULT_PANEL_PREFERENCES.map(preference => {
        const slot = saved[preference.id];
        return {
          ...preference,
          chartType: preference.chartType === ChartType.OHLC
            ? ChartType.OHLC
            : slot?.chartType ?? preference.chartType,
          visible: preference.chartType === ChartType.OHLC
            ? true
            : slot?.visible ?? preference.visible
        };
      });
    } catch {
      return this.loadLegacyVisibility();
    }
  }

  private persistVisibility(preferences: readonly PanelPreference[]): void {
    try {
      const slots = Object.fromEntries(
        preferences.map(preference => [preference.id, {
          chartType: preference.chartType,
          visible: preference.visible
        }])
      );
      localStorage.setItem(this.storageKey, JSON.stringify(slots));
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }

  private loadLegacyVisibility(): PanelPreference[] {
    try {
      const stored = localStorage.getItem(this.legacyVisibilityKey);
      if (!stored) return [...DEFAULT_PANEL_PREFERENCES];

      const visibility = JSON.parse(stored) as Record<string, unknown>;
      return DEFAULT_PANEL_PREFERENCES.map(preference => ({
        ...preference,
        visible: preference.chartType === ChartType.OHLC
          ? true
          : typeof visibility[preference.chartType.toLowerCase()] === 'boolean'
            ? visibility[preference.chartType.toLowerCase()] as boolean
            : preference.visible
      }));
    } catch {
      return [...DEFAULT_PANEL_PREFERENCES];
    }
  }
}
