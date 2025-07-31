
import { Injectable, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { OhlcChartComponent } from '../components/ohlc-chart/ohlc-chart.component';
import { ChartType } from '../enums/chart-type';
import { chartConfig } from '../interfaces/chart-config';
//import { ChartType } from '../../models/chart-type.enum';
//import { chartConfig } from '../config/chart-config';
//import { OhlcChartComponent } from '../charts/ohlc-chart/ohlc-chart.component';
//import { MacdChartComponent } from '../charts/macd-chart/macd-chart.component';
// Add more as needed

@Injectable({ providedIn: 'root' })
export class ChartInjectionService {
  // Map ChartType enum to component classes
  private chartComponentMap: Partial<Record<ChartType, Type<any>>> = {
    [ChartType.OHLC]: OhlcChartComponent,
 //   [ChartType.MACD]: MacdChartComponent,
    // Add additional chart components here
  };

  /**
   * Injects chart components based on chartConfig
   * @param containers A map of ViewContainerRefs keyed by ChartType
   * @param context Optional inputs to apply (e.g., data, scales)
   */
  injectCharts(
    containers: Record<ChartType, ViewContainerRef>,
    context: {
      data?: any;
      dateScaleX?: any;
    } = {}
  ): Record<ChartType, ComponentRef<any>> {
    const injected: Record<ChartType, ComponentRef<any>> = {} as any;

    for (const entry of chartConfig) {
      if (!entry.include) continue;

      const chartType = entry.type;
      const container = containers[chartType];
      const componentClass = this.chartComponentMap[chartType];

      if (!container || !componentClass) {
        console.warn(`[ChartInjectionService] Missing container or component for ${chartType}`);
        continue;
      }

      const compRef = container.createComponent(componentClass);
      if (context.data) compRef.instance.data = context.data;
      if (context.dateScaleX && 'dateScaleX' in compRef.instance) {
        compRef.instance.dateScaleX = context.dateScaleX;
      }

      injected[chartType] = compRef;
    }

    return injected;
  }
}
