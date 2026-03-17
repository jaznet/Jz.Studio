import { Injectable, AfterViewInit, ElementRef } from "@angular/core";
import { select, Selection } from "d3-selection";
import { AxisLayout, AxisLayoutRefs } from "../../parts/axis-layout";
import { ChartType } from "../../../enums/chart-type";
import { ReplaySubject, take } from "rxjs";
import { ChartDataService } from "../../chart-data.service";
import { PanelLayoutService } from "../../../engine/layout/panel-layout.service";

@Injectable()
export abstract class BaseChartLayoutService implements AfterViewInit {
  protected data: any[] = [];

  public gContent!: Selection<SVGGElement, unknown, null, undefined>;
  public rContent!: Selection<SVGRectElement, unknown, null, undefined>;
  public gChart!: Selection<SVGGElement, unknown, null, undefined>;
  public axisLeft = new AxisLayout();
  public axisRight = new AxisLayout();

  protected abstract chartType: ChartType;
  protected abstract setSize(width: number, height: number): void;

  constructor(
    protected layoutService: PanelLayoutService,
    protected dataService: ChartDataService) { }

  ngAfterViewInit(): void {
    const sizeStream = this.getSizeStreamForChartType(this.chartType);
    sizeStream?.pipe(take(1)).subscribe(({ width, height }) => {
      this.setSize(width, height);
    });
  }

  protected getSizeStreamForChartType(chartType: ChartType): ReplaySubject<{ width: number; height: number }> | undefined {
    switch (chartType) {
      case ChartType.MACD: return this.layoutService.macdSizeReady$;
      case ChartType.RSI: return this.layoutService.rsiSizeReady$;
      case ChartType.VOLUME: return this.layoutService.volumeSizeReady$;
      case ChartType.OHLC: return this.layoutService.ohlcSizeReady$;
      default: return undefined;
    }
  }

}
