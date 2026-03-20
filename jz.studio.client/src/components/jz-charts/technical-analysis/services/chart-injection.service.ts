import { Injectable, ViewContainerRef, ComponentRef, Type } from '@angular/core';
import { ChartType } from '../enums/chart-type';
import { chartConfig } from '../interfaces/chart-config';
import { OhlcChartComponent } from '../charts/ohlc/ohlc-chart.component';
import { ScaffoldComponent } from '../charts/_scaffold/scaffold.component';
// 🚫 MacdChartComponent intentionally omitted

type ChartComponentMap = Partial<Record<ChartType, Type<ScaffoldComponent>>>;

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
  ): Record<ChartType, ComponentRef<ScaffoldComponent>> {
    const injected: Record<ChartType, ComponentRef<ScaffoldComponent>> = {} as any;

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
    //  compRef.instance.data = context.data ?? [];

      if ('dateScaleX' in compRef.instance) {
        (compRef.instance as any).dateScaleX = context.dateScaleX;
      }

      injected[chartType] = compRef;
    }

    return injected;
  }
}
