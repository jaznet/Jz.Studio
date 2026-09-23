import { ChartType } from '../../enums/chart-type';
import { PanelPreferenceService } from './panel-preference.service';

describe('PanelPreferenceService', () => {
  const storageKey = 'jz.technical-analysis.panel-slots.v1';
  const defaultStorageKey = 'jz.technical-analysis.panel-slot-defaults.v1';

  beforeEach(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(defaultStorageKey);
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(defaultStorageKey);
  });

  it('starts with the factory indicator layout', () => {
    const service = new PanelPreferenceService();

    expect(indicatorTypes(service)).toEqual([
      ChartType.VOLUME,
      ChartType.MACD,
      ChartType.RSI
    ]);
  });

  it('assigns an unused indicator to a slot', () => {
    const service = new PanelPreferenceService();

    service.assignIndicator('slot-1', ChartType.ATR);

    expect(chartTypeFor(service, 'slot-1')).toBe(ChartType.ATR);
  });

  it('swaps occupied indicators instead of creating duplicates', () => {
    const service = new PanelPreferenceService();

    service.assignIndicator('slot-1', ChartType.RSI);

    expect(chartTypeFor(service, 'slot-1')).toBe(ChartType.RSI);
    expect(chartTypeFor(service, 'slot-3')).toBe(ChartType.VOLUME);
    expect(indicatorTypes(service).filter(type => type === ChartType.RSI).length).toBe(1);
  });

  it('persists the current slot layout for the next service instance', () => {
    const service = new PanelPreferenceService();
    service.assignIndicator('slot-2', ChartType.WILLIAMS_R);

    const reloaded = new PanelPreferenceService();

    expect(chartTypeFor(reloaded, 'slot-2')).toBe(ChartType.WILLIAMS_R);
  });

  it('restores a saved user default independently of the current layout', () => {
    const service = new PanelPreferenceService();
    service.assignIndicator('slot-1', ChartType.AROON);
    service.assignIndicator('slot-2', ChartType.ATR);
    service.saveCurrentAsDefault();
    service.assignIndicator('slot-1', ChartType.BOLLINGER_WIDTH);

    service.resetToDefaults();

    expect(chartTypeFor(service, 'slot-1')).toBe(ChartType.AROON);
    expect(chartTypeFor(service, 'slot-2')).toBe(ChartType.ATR);
    expect(service.isDefaultLayout()).toBeTrue();
  });

  it('restores the factory layout without deleting the saved user default', () => {
    const service = new PanelPreferenceService();
    service.assignIndicator('slot-1', ChartType.ADX);
    service.saveCurrentAsDefault();

    service.restoreFactoryDefaults();

    expect(indicatorTypes(service)).toEqual([
      ChartType.VOLUME,
      ChartType.MACD,
      ChartType.RSI
    ]);
    expect(service.hasUserDefault()).toBeTrue();

    service.resetToDefaults();
    expect(chartTypeFor(service, 'slot-1')).toBe(ChartType.ADX);
  });
});

function chartTypeFor(
  service: PanelPreferenceService,
  preferenceId: string
): ChartType | undefined {
  return service.getPreferences()
    .find(preference => preference.id === preferenceId)?.chartType;
}

function indicatorTypes(service: PanelPreferenceService): ChartType[] {
  return service.getPreferences()
    .filter(preference => preference.chartType !== ChartType.OHLC)
    .map(preference => preference.chartType);
}
