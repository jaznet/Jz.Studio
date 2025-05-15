import { ElementRef, Injectable } from '@angular/core';
import { scaffold, SectionAttributes, SvgAttributes } from '../interfaces/techan-interfaces';
import { Selection } from 'd3-selection';
import { MacdChartLayoutService } from './charts/macd/macd-chart-layout.service';
import { MacdChartService } from './charts/macd/macd-chart.service';
import { RsiChart } from './charts/rsi/rsi-chart.service';
import { RsiChartLayoutService } from './charts/rsi/rsi-chart-layout.service';
import { VolumeChartService } from './charts/volume/volume-chart.service';
import { VolumeChartLayoutService } from './charts/volume/volume-chart-layout.service';
import { OhlcChartService } from './charts/ohlc/ohlc-chart.service';
import { OhlcChartLayoutService } from './charts/ohlc/ohlc-chart-layout.service';

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
    width: 0, height: 0, xAxisTop: 32, xAxisBottom: 32, yAxisLeft: 40, yAxisRight: 40, sectionsContainer: {}, sections: [this.ohlc,this.volume,this.macd,this.rsi] };
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
    private macdChart: MacdChartService,
    private macdLayout: MacdChartLayoutService,
    private rsiLayout: RsiChartLayoutService
  ) { }

  createScaffolding() {
    this.loadSections();
    this.sizeSections();
    this.alignChartsToScaffold();
  }

  loadSections() {
    this.scaffold.sections[0] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .4
    };
    this.scaffold.sections[1] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections[2] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
    this.scaffold.sections[3] = {
      x: 0, y: 0, width: 0, height: 0,
      margins: { top: 0, right: 40, bottom: 0, left: 40 },
      content: { width: 0, height: 0, x: 0, y: 0 },
      spacer: 0,
      pct: .2
    };
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
    this.spacerAdjusted = this.spacer * (1 + (1 / this.scaffold.sections.length));
    this.rSectionsContainer.setAttribute('width', `${this.scaffold.width}`);
    this.rSectionsContainer.setAttribute('height', `${this.scaffold.height - this.scaffold.xAxisTop - this.scaffold.xAxisBottom}`);
    console.log(this.rSectionsContainer);
    this.scaffold.sections[0].height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[0].pct;
    this.scaffold.sections[1].height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[1].pct;
    this.scaffold.sections[2].height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[2].pct;
    this.scaffold.sections[3].height = (this.rSectionsContainer.height.baseVal.value - (this.spacer * 5)) * this.scaffold.sections[3].pct;

    this.scaffold.sections[0].width = this.rSectionsContainer.width.baseVal.value;
    this.scaffold.sections[1].width = this.rSectionsContainer.width.baseVal.value;
    this.scaffold.sections[2].width = this.rSectionsContainer.width.baseVal.value;
    this.scaffold.sections[3].width = this.rSectionsContainer.width.baseVal.value;
    // #endregion MAIN

    // #region OHLC
    this.ohlcLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.ohlcLayout.rSection.attr('height', `${((this.rSectionsContainer.height.baseVal.value - (5 * this.spacer)) * this.scaffold.sections[0].pct) }`);
    this.ohlcLayout.rContent.attr('width', `${this.scaffold.sections[0].width - this.scaffold.sections[0].margins.left - this.scaffold.sections[0].margins.right}`);

    console.log(this.ohlcLayout.rSection.node()!.height.baseVal.value);
    this.scaffold.sections[0].width = this.ohlcLayout.rSection.node()!.width.baseVal.value;
    this.scaffold.sections[0].height = (this.ohlcLayout.rSection.node()!.height.baseVal.value);
    this.scaffold.sections[0].content.width = (this.ohlcLayout.rContent.node()!.width.baseVal.value);
    this.scaffold.sections[0].content.height = (this.ohlcLayout.rContent.node()!.height.baseVal.value);
    this.ohlcLayout.rContent.attr('height', `${this.scaffold.sections[0].height}`);
    this.ohlcLayout.axisLeft.rAxis.attr('width', `${this.scaffold.sections[0].margins.right}`);
    this.ohlcLayout.axisLeft.rAxis.attr('height', `${this.scaffold.sections[0].height - this.scaffold.sections[0].margins.top}`);
    this.ohlcLayout.axisRight.rAxis.attr('width', `${this.scaffold.sections[0].margins.right}`);
    this.ohlcLayout.axisRight.rAxis.attr('height', `${this.scaffold.sections[0].height - this.scaffold.sections[0].margins.top}`);
    // #endregion OHLC

    // #region VOLUME
    this.volumeLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.volumeLayout.rSection.attr('height', `${(this.rSectionsContainer.height.baseVal.value * this.scaffold.sections[1].pct) - this.spacerAdjusted}`);

    this.scaffold.sections[1].width = this.volumeLayout.rSection.node()!.width.baseVal.value;
    this.scaffold.sections[1].height = this.volumeLayout.rSection.node()!.height.baseVal.value;

    this.volumeLayout.axisLeft.gAxis.attr('width', `${this.scaffold.sections[1].margins.left}`);
    this.volumeLayout.axisLeft.gAxis.attr('height', `${this.scaffold.sections[1].height}`);
    this.volumeLayout.axisRight.gAxis.attr('width', `${this.scaffold.sections[1].margins.right}`);
    this.volumeLayout.axisRight.gAxis.attr('height', `${this.scaffold.sections[1].height}`);
    // #endregion VOLUME

    // #region MACD
    this.macdLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.macdLayout.rSection.attr('height', `${(this.rSectionsContainer.height.baseVal.value * this.scaffold.sections[2].pct) - this.spacerAdjusted}`);
    this.scaffold.sections[2].width = this.macdLayout.rSection.node()?.width.baseVal.value ?? 0;
    this.scaffold.sections[2].height = this.macdLayout.rSection.node()?.height.baseVal.value ?? 0;

    this.macdLayout.axisLeft.gAxis.attr('width', `${this.scaffold.sections[2].margins.right}`);
    this.macdLayout.axisLeft.gAxis.attr('height', `${this.scaffold.sections[2].height}`);

    this.macdLayout.axisRight.gAxis.attr('width', `${this.scaffold.sections[2].margins.right}`);
    this.macdLayout.axisRight.gAxis.attr('height', `${this.scaffold.sections[2].height}`);

    this.macdLayout.axisLeft.gAxis.attr('transform', `translate(0,0)`);
    //  this.macdLayout.gMacdAxisRight.attr('transform', `translate(${this.scaffold.sections[2].width - this.scaffold.sections[2].margins.right},${this.scaffold.sections[2].margins.top})`);

    this.macdLayout.rContent.attr('width', `${this.scaffold.sections[2].width - this.scaffold.sections[2].margins.left - this.scaffold.sections[2].margins.right}`);
    this.macdLayout.rContent.attr('height', `${this.scaffold.sections[2].height}`);
 
    // #endregion MACD

    // #region RSI
    this.rsiLayout.rSection.attr('width', `${this.rSectionsContainer.width.baseVal.value}`);
    this.rsiLayout.rSection.attr('height', `${((this.rSectionsContainer.height.baseVal.value - (this.spacer*5)) * this.scaffold.sections[3].pct) }`);
    this.scaffold.sections[3].width = this.rsiLayout.rSection.node()?.width.baseVal.value ?? 0;
    this.scaffold.sections[3].height = this.rsiLayout.rSection.node()?.height.baseVal.value ?? 0;
    this.rsiLayout.rContent.attr('width', `${this.scaffold.sections[3].width - this.scaffold.sections[3].margins.left - this.scaffold.sections[3].margins.right}`);
    this.rsiLayout.rContent.attr('height', `${this.scaffold.sections[3].height}`);
  }

  alignChartsToScaffold(): void {
    this.xAxisTopGroup.setAttribute('transform', `translate(0,0)`);
    this.xAxisMonthsTop.setAttribute('transform', `translate(40,32)`);

    this.xAxisBottomGroup.setAttribute('transform', `translate(0,${this.scaffold.height - this.scaffold.xAxisBottom})`);
    this.xAxisMonthsBottom.setAttribute('transform', `translate(40,0)`);

    this.sectionsContainer.setAttribute('transform', `translate(0,${this.scaffold.xAxisTop})`)

    this.ohlcLayout.gSection.attr('transform', `translate(0,${this.spacer})`);
    this.ohlcLayout.gContent.attr('transform', `translate(${this.scaffold.sections[0].margins.left},0)`);
    this.ohlcLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[0].margins.left + this.scaffold.sections[0].content.width},0)`);
    this.ohlcLayout.axisRight.gAxis.attr('transform', 'translate(0)');
    console.log('layout',this.ohlcLayout.axisLeft, this.ohlcLayout.axisRight);

    this.volumeLayout.gSection.attr('transform', `translate(0,${this.scaffold.sections[0].height + this.spacer + this.spacer})`);
    this.volumeLayout.gContent.attr('transform', `translate(${this.scaffold.sections[1].margins.left},0)`);
    this.volumeLayout.axisLeft.gAxis.attr('transform', `translate(${this.scaffold.sections[1].margins.left},0)`)
    this.volumeLayout.axisLeft.gAxisGroup.attr('transform', `translate(0)`);
    this.volumeLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[1].width - this.scaffold.sections[1].margins.right})`);

    this.macdLayout.gSection.attr('transform', `translate(0,  ${(this.scaffold.sections[0].height + this.scaffold.sections[1].height + (this.spacer * 3))})`);
    this.macdLayout.gContent.attr('transform', `translate(${this.scaffold.sections[2].margins.left},0)`);
    this.macdLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[2].width - this.scaffold.sections[2].margins.right},0)`);
    this.macdLayout.axisLeft.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[2].margins.left },0)`);
    
    this.rsiLayout.gSection.attr('transform', `translate( 0,  ${(this.scaffold.sections[0].height + this.scaffold.sections[1].height + this.scaffold.sections[2].height) + (this.spacer * 4)})`);
    this.rsiLayout.axisRight.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[3].width - this.scaffold.sections[3].margins.right},${this.scaffold.sections[3].margins.top})`);
    this.rsiLayout.axisLeft.gAxisGroup.attr('transform', `translate(${this.scaffold.sections[3].margins.left},0)`);
    this.rsiLayout.gContent.attr('transform', `translate(${this.scaffold.sections[3].margins.left},0)`);
  }
}
