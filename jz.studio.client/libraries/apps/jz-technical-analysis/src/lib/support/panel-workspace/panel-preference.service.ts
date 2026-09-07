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
  private readonly defaultStorageKey = 'jz.technical-analysis.panel-slot-defaults.v1';
  private readonly legacyVisibilityKey = 'jz.technical-analysis.panel-visibility.v1';
  private userDefaultPreferences = this.loadUserDefaultPreferences();
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
    this.setPreferences(this.userDefaultPreferences
      ?? [...DEFAULT_PANEL_PREFERENCES]);
  }

  saveCurrentAsDefault(): void {
    this.userDefaultPreferences = this.getPreferences();
    this.persistPreferences(this.defaultStorageKey, this.userDefaultPreferences);
  }

  restoreFactoryDefaults(): void {
    this.setPreferences([...DEFAULT_PANEL_PREFERENCES]);
  }

  hasUserDefault(): boolean {
    return this.userDefaultPreferences !== undefined;
  }

  isDefaultLayout(): boolean {
    return this.layoutsMatch(
      this._preferences.value,
      this.userDefaultPreferences ?? DEFAULT_PANEL_PREFERENCES
    );
  }

  private layoutsMatch(
    preferences: readonly PanelPreference[],
    defaults: readonly PanelPreference[]
  ): boolean {
    return defaults.every(defaultPreference => {
      const preference = preferences.find(item =>
        item.id === defaultPreference.id
      );
      return preference?.chartType === defaultPreference.chartType
        && preference.visible === defaultPreference.visible;
    });
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
    this.persistPreferences(this.storageKey, preferences);
  }

  private persistPreferences(
    storageKey: string,
    preferences: readonly PanelPreference[]
  ): void {
    try {
      const slots = Object.fromEntries(
        preferences.map(preference => [preference.id, {
          chartType: preference.chartType,
          visible: preference.visible
        }])
      );
      localStorage.setItem(storageKey, JSON.stringify(slots));
    } catch {
      // Storage can be unavailable in restricted browser contexts.
    }
  }

  private loadUserDefaultPreferences(): PanelPreference[] | undefined {
    try {
      const stored = localStorage.getItem(this.defaultStorageKey);
      if (!stored) return undefined;

      const saved = JSON.parse(stored) as Record<string, {
        chartType?: ChartType;
        visible?: boolean;
      }>;
      return DEFAULT_PANEL_PREFERENCES.map(preference => ({
        ...preference,
        chartType: preference.chartType === ChartType.OHLC
          ? ChartType.OHLC
          : saved[preference.id]?.chartType ?? preference.chartType,
        visible: preference.chartType === ChartType.OHLC
          ? true
          : saved[preference.id]?.visible ?? preference.visible
      }));
    } catch {
      return undefined;
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
