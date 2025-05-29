import { ElementRef, Injectable } from '@angular/core';
import { scaffold, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';
import { Selection } from 'd3-selection';
import { MacdChartService } from './charts/macd/macd-chart.service';
import { RsiChart } from './charts/rsi/rsi-chart.service';
import { RsiChartLayoutService } from './charts/rsi/rsi-chart-layout.service';
import { VolumeChartService } from './charts/volume/volume-chart.service';
import { VolumeChartLayoutService } from './charts/volume/volume-chart-layout.service';
import { OhlcChartService } from './charts/ohlc/ohlc-chart.service';
import { OhlcChartLayoutService } from './charts/ohlc/ohlc-chart-layout.service';
import { MacdChartComponent } from '../components/macd-chart/macd-chart.component';
import { BaseChartComponent } from './charts/base/base-chart-component.directive';
/*import chart from 'devextreme/viz/chart';*/
import { ChartType } from '../enums/chart-type';
import { BaseChartLayoutService } from './charts/base/base-chart-layout-service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  // #region PROPERTIES
  svgBorder = 8;
  divSvgContainer!: Selection<HTMLDivElement, unknown, null, undefined>;
  svgElement!: Selection<SVGElement, unknown, null, undefined>;
  rSvgElement!: Selection<SVGRectElement, unknown, null, undefined>;

  ohlc!: SectionAttributes;
  volume!: SectionAttributes;
  macd!: SectionAttributes;
  rsi!: SectionAttributes;

  scaffold: scaffold = {
    width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, sectionsContainer: {},
    sections: {
      [ChartType.OHLC]: this.ohlc,
      [ChartType.VOLUME]: this.volume,
      [ChartType.MACD]: this.macd,
      [ChartType.RSI]: this.rsi
    }


  };
  svg_attributes: SvgAttributes = { width: 0, height: 0 };

  sectionsContainer!: SVGGElement;
  rSectionsContainer!: SVGRectElement;
  spacer=0;
  spacerAdjusted = 0;

  sma1!: SVGElement;
  sma2!: SVGElement;
  sma3!: SVGElement;

  // #region Axes
  xAxisMonthsTop!: SVGGElement;
  xAxisMonthsBottom!: SVGGElement;
  xAxisDays!: SVGGElement;
  xAxisTopGroup!: SVGGElement;
  xAxisTopRect!: SVGRectElement;

  xAxisBottom!: SVGGElement;
  xAxisBottomGroup!: SVGGElement;
  xAxisBottomRect!: SVGRectElement;

  rectVolume!: SVGRectElement;
  // #endregion

  constructor(
    private ohlcChart: OhlcChartService,
    private ohlcLayout: OhlcChartLayoutService,
    private gVolumeChart: VolumeChartService,
    private volumeLayout: VolumeChartLayoutService,
    private macdChart: MacdChartComponent,

    private macdService: MacdChartService,
    private rsiLayout: RsiChartLayoutService
  ) { }

  createScaffolding() {
    this.loadSections();
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  loadSections() {
    this.scaffold.sections[ChartType.OHLC] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .4
    };
    this.scaffold.sections['volume'] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections['macd'] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections['rsi'] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
  }

  // layout.service.ts

  getLayoutByChartType(chartType: ChartType): BaseChartLayoutService | undefined {
    switch (chartType) {
      case ChartType.MACD:
        return this.macdService;
      case ChartType.VOLUME:
        return this.volumeLayout;
      case ChartType.OHLC:
        return this.ohlcLayout;
      case ChartType.RSI:
        return this.rsiLayout;
      default:
        console.warn(`Layout service not found for chart type: ${chartType}`);
        return undefined;
    }
  }


  sizeChartSection(chartType: ChartType): void {

    const section = this.scaffold.sections[chartType];
    if (!section) {
      console.warn(`No layout section found for chart type: ${chartType}`);
      return;
    }

    const layout = this.getLayoutByChartType(chartType);
    if (!layout) {
      console.warn(`No layout object found for chart type: ${chartType}`);
      return;
    }

    const width = this.rSectionsContainer!.width.baseVal.value;
    const height = this.rSectionsContainer!.height.baseVal.value;

    layout.rSection.attr('width', `${width}`);
    layout.rSection.attr('height', `${height}`);

    //scaffoldSection!.width = width;
    //scaffoldSection!.height = height;

    layout.axisLeft.gAxis.attr('width', `${section.margins.right}`);
    layout.axisLeft.gAxis.attr('height', `${height}`);

    layout.axisRight.gAxis.attr('width', `${section.margins.right}`);
    layout.axisRight.gAxis.attr('height', `${height}`);

    layout.rContent.attr('width', `${width - section.margins.left - section.margins.right}`);
    layout.rContent.attr('height', `${height}`);

  }


  sizeSections(): void {
    this.spacer = 8;

    this.scaffold.width = this.divSvgContainer.node()!.clientWidth - (this.svgBorder * 2);
    this.scaffold.height = this.divSvgContainer.node()!.clientHeight - (this.svgBorder * 2);

    // #region MAIN
    this.svgElement.attr('width', `${this.scaffold.width}`);
    this.svgElement.attr('height', `${this.scaffold.height}`);
    this.rSvgElement.attr('width', `${this.scaffold.width}`);
    this.rSvgElement.attr('height', `${this.scaffold.height}`);

    // X-AXIS TOP
    this.xAxisTopRect.setAttribute('width', `${this.scaffold.width}`);
    this.xAxisTopRect.setAttribute('height', `${this.scaffold.xAxisTop}`);

    // X AXIS BOTTOM
    this.xAxisBottomRect.setAttribute('width', `${this.scaffold.width}`);
    this.xAxisBottomRect.setAttribute('height', `${this.scaffold.xAxisBottom}`);
    //this.xAxisBottomRect.setAttribute('fill', 'var(--plt-chart-2');

    // SECTIONS
 //   this.spacerAdjusted = this.spacer * (1 + (1 / this.scaffold.sections.he));
    this.rSectionsContainer.setAttribute('width', `${this.scaffold.width}`);
    this.rSectionsContainer.setAttribute('height', `${this.scaffold.height - this.scaffold.xAxisTop - this.scaffold.xAxisBottom}`);
    console.log(this.rSectionsContainer);
    this.scaffold.sections[ChartType.OHLC]!.height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.OHLC]!.pct;
    this.scaffold.sections[ChartType.VOLUME]!.height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.VOLUME]!.pct;
    this.scaffold.sections[ChartType.MACD]!.height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.MACD]!.pct;
    this.scaffold.sections[ChartType.RSI]!.height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[ChartType.RSI]!.pct;

    this.scaffold.sections[ChartType.OHLC]!.width = this.rSectionsContainer.width.baseVal.value;
    this.scaffold.sections[ChartType.VOLUME]!.width = this.rSectionsContainer.width.baseVal.value;
    this.scaffold.sections[ChartType.MACD]!.width = this.rSectionsContainer.width.baseVal.value;
    this.scaffold.sections[ChartType.RSI]!.width = this.rSectionsContainer.width.baseVal.value;
    // #endregion MAIN

    // #region OHLC
    this.ohlcLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.ohlcLayout.rSection.attr('height', `${((this.rSectionsContainer.height.baseVal.value - (5 * this.spacer)) * this.scaffold.sections[ChartType.OHLC]!.pct)}`);
    this.ohlcLayout.rContent.attr('width', `${this.scaffold.sections[ChartType.OHLC]!.width - this.scaffold.sections[ChartType.OHLC]!.margins.left - this.scaffold.sections[ChartType.OHLC]!.margins.right}`);

    console.log(this.ohlcLayout.rSection.node()!.height.baseVal.value);
    this.scaffold.sections[ChartType.OHLC]!.width = this.ohlcLayout.rSection.node()!.width.baseVal.value;
    this.scaffold.sections[ChartType.OHLC]!.height = (this.ohlcLayout.rSection.node()!.height.baseVal.value);
    this.scaffold.sections[ChartType.OHLC]!.content.width = (this.ohlcLayout.rContent.node()!.width.baseVal.value);
    this.scaffold.sections[ChartType.OHLC]!.content.height = (this.ohlcLayout.rContent.node()!.height.baseVal.value);
    this.ohlcLayout.rContent.attr('height', `${this.scaffold.sections[ChartType.OHLC]!.height}`);
    this.ohlcLayout.axisLeft.rAxis.attr('width', `${this.scaffold.sections[ChartType.OHLC]!.margins.right}`);
    this.ohlcLayout.axisLeft.rAxis.attr('height', `${this.scaffold.sections[ChartType.OHLC]!.height - this.scaffold.sections[ChartType.OHLC]!.margins.top}`);
    this.ohlcLayout.axisRight.rAxis.attr('width', `${this.scaffold.sections[ChartType.OHLC]!.margins.right}`);
    this.ohlcLayout.axisRight.rAxis.attr('height', `${this.scaffold.sections[ChartType.OHLC]!.height - this.scaffold.sections[ChartType.OHLC]!.margins.top}`);
    // #endregion OHLC

    // #region VOLUME
    this.volumeLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.volumeLayout.rSection.attr('height', `${(this.rSectionsContainer.height.baseVal.value * this.scaffold.sections[ChartType.VOLUME]!.pct) - this.spacerAdjusted}`);

    this.scaffold.sections[ChartType.VOLUME]!.width = this.volumeLayout.rSection.node()!.width.baseVal.value;
    this.scaffold.sections[ChartType.VOLUME]!.height = this.volumeLayout.rSection.node()!.height.baseVal.value;

    this.volumeLayout.axisLeft.gAxis.attr('width', `${this.scaffold.sections[ChartType.VOLUME]!.margins.left}`);
    this.volumeLayout.axisLeft.gAxis.attr('height', `${this.scaffold.sections[ChartType.VOLUME]!.height}`);
    this.volumeLayout.axisRight.gAxis.attr('width', `${this.scaffold.sections[ChartType.VOLUME]!.margins.right}`);
    this.volumeLayout.axisRight.gAxis.attr('height', `${this.scaffold.sections[ChartType.VOLUME]!.height}`);
    // #endregion VOLUME

    // #region MACD
    this.macdService.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.macdService.rSection.attr('height', `${(this.rSectionsContainer.height.baseVal.value * this.scaffold.sections[ChartType.MACD]!.pct) - this.spacerAdjusted}`);
    this.scaffold.sections[ChartType.MACD]!.width = this.macdService.rSection.node()?.width.baseVal.value ?? 0;
    this.scaffold.sections[ChartType.MACD]!.height = this.macdService.rSection.node()?.height.baseVal.value ?? 0;

    this.macdService.axisLeft.gAxis.attr('width', `${this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    this.macdService.axisLeft.gAxis.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);

    this.macdService.axisRight.gAxis.attr('width', `${this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    this.macdService.axisRight.gAxis.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);

    this.macdService.axisLeft.gAxis.attr('transform', `translate(0,0)`);
    //  this.macdChart.gMacdAxisRight.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.right},${this.scaffold.sections[ChartType.MACD]!.margins.top})`);

    this.macdService.rContent.attr('width', `${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.left - this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    this.macdService.rContent.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);
 
    // #endregion MACD

    // #region RSI
    this.rsiLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.rsiLayout.rSection.attr('height', `${((this.rSectionsContainer.height.baseVal.value - (this.spacer*5)) * this.scaffold.sections[ChartType.MACD]!.pct) }`);
    this.scaffold.sections[ChartType.MACD]!.width = this.rsiLayout.rSection.node()?.width.baseVal.value ?? 0;
    this.scaffold.sections[ChartType.MACD]!.height = this.rsiLayout.rSection.node()?.height.baseVal.value ?? 0;
    this.rsiLayout.rContent.attr('width', `${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.left - this.scaffold.sections[ChartType.MACD]!.margins.right}`);
    this.rsiLayout.rContent.attr('height', `${this.scaffold.sections[ChartType.MACD]!.height}`);
  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.scaffold.height - this.scaffold.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.sectionsContainer.setAttribute('transform', `translate(0,${this.scaffold.xAxisTop})`)

    this.ohlcLayout.gSection.attr('transform', `translate(0,${this.spacer})`);
    this.ohlcLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.OHLC]!.margins.left},0)`);
    this.ohlcLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.OHLC]!.margins.left + this.scaffold.sections[ChartType.OHLC]!.content.width},0)`);
    this.ohlcLayout.axisRight.gAxis.attr('transform', 'translate(0)');
    console.log('layout',this.ohlcLayout.axisLeft, this.ohlcLayout.axisRight);

    this.volumeLayout.gSection.attr('transform', `translate(0,${this.scaffold.sections[ChartType.VOLUME]!.height + this.spacer + this.spacer})`);
    this.volumeLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.VOLUME]!.margins.left},0)`);
    this.volumeLayout.axisLeft.gAxis.attr('transform', `translate(${this.scaffold.sections[ChartType.VOLUME]!.margins.left},0)`)
    this.volumeLayout.axisLeft.gAxisGroup.attr('transform', `translate(0)`);
    this.volumeLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.VOLUME]!.width - this.scaffold.sections[ChartType.VOLUME]!.margins.right})`);

    this.macdService.gSection.attr('transform', `translate(0,  ${(this.scaffold.sections[ChartType.OHLC]!.height + this.scaffold.sections[ChartType.VOLUME]!.height + (this.spacer * 3))})`);
    this.macdService.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
    this.macdService.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.right},0)`);
    this.macdService.axisLeft.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left },0)`);
    
    this.rsiLayout.gSection.attr('transform', `translate( 0,  ${(this.scaffold.sections[ChartType.OHLC]!.height + this.scaffold.sections[ChartType.VOLUME]!.height + this.scaffold.sections[ChartType.MACD]!.height) + (this.spacer * 4)})`);
    this.rsiLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.width - this.scaffold.sections[ChartType.MACD]!.margins.right},${this.scaffold.sections[ChartType.MACD]!.margins.top})`);
    this.rsiLayout.axisLeft.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
    this.rsiLayout.gContent.attr('transform', `translate(${this.scaffold.sections[ChartType.MACD]!.margins.left},0)`);
  }
}
