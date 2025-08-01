import { Injectable, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { BaseChartComponent } from '../components/base/base-chart/base-chart.component';
import { OhlcChartComponent } from '../components/ohlc-chart/ohlc-chart.component';
import { ChartType } from '../enums/chart-type';
import { chartConfig } from '../interfaces/chart-config';
// 🚫 MacdChartComponent intentionally omitted

type ChartComponentMap = Partial<Record<ChartType, Type<BaseChartComponent>>>;

@Injectable({ providedIn: 'root' })
export class ChartInjectionService {
  private chartComponentMap: ChartComponentMap = {
    [ChartType.OHLC]: OhlcChartComponent,
    // [ChartType.MACD]: MacdChartComponent, // ← omit for now
  };

  injectCharts(
    containers: Partial<Record<ChartType, ViewContainerRef>>,
    context: {
      data?: any;
      dateScaleX?: any;
    } = {}
  ): Record<ChartType, ComponentRef<BaseChartComponent>> {
    const injected: Record<ChartType, ComponentRef<BaseChartComponent>> = {} as any;

    for (const entry of chartConfig) {
      if (!entry.include) continue;

      const chartType = entry.type;
      const componentType = this.chartComponentMap[chartType];
      const container = containers[chartType];

      if (!componentType || !container) {
        console.warn(`[ChartInjectionService] Missing component or container for ${chartType}`);
        continue;
      }

      const compRef = container.createComponent(componentType);
      compRef.instance.data = context.data ?? [];

      if ('dateScaleX' in compRef.instance) {
        (compRef.instance as any).dateScaleX = context.dateScaleX;
      }

      injected[chartType] = compRef;
    }

    return injected;
  }
}
