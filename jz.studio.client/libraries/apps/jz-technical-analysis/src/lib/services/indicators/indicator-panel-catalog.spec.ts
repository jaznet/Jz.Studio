import { INDICATOR_PANEL_CHOICES } from '../../charts/base-chart/base-chart.component';
import { ChartType } from '../../enums/chart-type';
import { ChartComponentMap } from '../../maps/chart-component-map';
import { IndicatorCatalogService } from './indicator-catalog.service';

describe('Indicator panel catalog', () => {
  it('contains one unique entry for every selectable chart type', () => {
    const chartTypes: ChartType[] = INDICATOR_PANEL_CHOICES.map(
      choice => choice.chartType
    );

    expect(new Set(chartTypes).size).toBe(chartTypes.length);
    expect(chartTypes.length).toBe(9);
    expect(chartTypes).not.toContain(ChartType.OHLC);
  });

  it('gives every selectable indicator a complete display label', () => {
    for (const choice of INDICATOR_PANEL_CHOICES) {
      expect(choice.label.trim().length)
        .withContext(`${choice.chartType} requires a display label`)
        .toBeGreaterThan(0);
    }
  });

  it('registers a chart component for every selectable indicator', () => {
    for (const choice of INDICATOR_PANEL_CHOICES) {
      expect(ChartComponentMap[choice.chartType])
        .withContext(`${choice.chartType} requires a chart component`)
        .toBeDefined();
    }
  });

  it('links calculated indicators to panel definitions in the catalog', () => {
    const catalog = new IndicatorCatalogService();
    const panelDefinitions = catalog.definitions.filter(
      definition => definition.placement === 'panel'
    );

    for (const choice of INDICATOR_PANEL_CHOICES) {
      if (!('catalogId' in choice)) continue;

      const definition = panelDefinitions.find(item => item.id === choice.catalogId);
      expect(definition)
        .withContext(`${choice.chartType} requires a panel catalog definition`)
        .toBeDefined();
      expect(definition?.defaultPeriod)
        .withContext(`${choice.chartType} requires a positive default period`)
        .toBeGreaterThan(0);
    }
  });

  it('does not register duplicate component types or catalog identifiers', () => {
    const components = INDICATOR_PANEL_CHOICES.map(
      choice => ChartComponentMap[choice.chartType]
    );
    const catalogIds = INDICATOR_PANEL_CHOICES
      .filter((choice): choice is typeof choice & { catalogId: string } =>
        'catalogId' in choice
      )
      .map(choice => choice.catalogId);

    expect(new Set(components).size).toBe(components.length);
    expect(new Set(catalogIds).size).toBe(catalogIds.length);
  });
});
