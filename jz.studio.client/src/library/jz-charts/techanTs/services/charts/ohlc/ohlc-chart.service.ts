
import { AfterViewInit, ElementRef, Injectable } from '@angular/core';
import { Selection, select } from 'd3-selection';
import { axisLeft, axisRight } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { ScalesService } from '../../scales.service';
import { ChartDataService } from '../../chart-data.service';
import { ohlcData, scaffold } from '../../../interfaces/techan-interfaces';
import { OhlcChartLayoutService } from './ohlc-chart-layout.service';
import { ChartType } from '../../../enums/chart-type';
import { LayoutService } from '../../layout.service';
import { BaseChartLayoutService } from '../base/base-chart-layout-service';

@Injectable({
  providedIn: 'root',
})
export class OhlcChartService extends BaseChartLayoutService implements AfterViewInit {

  protected override chartType!: ChartType;
  protected override setSize(width: number, height: number): void {
    throw new Error('Method not implemented.');
  }
  // Optional future customization
  // #region PROPERTIES




  // #endregion PROPERTIES

  constructor(
    private scales: ScalesService,
    dataService: ChartDataService,
    layoutService: LayoutService,
    private OhlcLayout: OhlcChartLayoutService
  ) { super(layoutService, dataService) }

  override ngAfterViewInit(): void {
 //   this.OhlcLayout.initializeSelections(this.buildRefs());
    }


}

