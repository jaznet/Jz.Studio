// jz-choro-dash.component.ts

import { Component, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';
import { ChoroStateComponent } from '../../_components/charts/jz-choropleths/components/choro-state/choro-state.component';
import { ChoroUsaComponent } from '../../_components/charts/jz-choropleths/components/choro-usa/choro-usa.component';
import { UserSelectionService } from './paint-factory/services/user-selection.service';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { TopoService } from '../../_components/charts/jz-choropleths/services/topo.service';
import { ChoroDataService } from '../../_components/charts/jz-choropleths/services/choro-data.service';
import { JzChoroDashPanelComponent } from '../../_components/jz-choro-dash-panel/jz-choro-dash-panel.component';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { COUNTY_PAINTING_STRATEGY } from '../../_components/charts/jz-choropleths/interface/county-painting-strategy.token';
import { PaintElectionStrategy } from './paint-factory/strategies/paint-election';

@Component({
  selector: 'jz-choro-dash',
  standalone: true,
  imports: [
    ChoroStateComponent,
    JzChoroDashPanelComponent,
    ChoroUsaComponent,
    DxRadioGroupModule
  ],
  templateUrl: './jz-choro-dash.component.html',
  styleUrl: './jz-choro-dash.component.scss',
  providers: [
    {
      provide: COUNTY_PAINTING_STRATEGY,
      useClass: PaintElectionStrategy
    }
  ]
})
export class JzChoroDashComponent implements OnInit {
  @HostBinding('class') classes = 'fit-to-parent grid-rows view-router-container';
  @ViewChild('choro_usa', { static: true }) ChoroUSA!: ChoroUsaComponent;
  @ViewChild('choro_state', { static: true }) ChoroState!: ChoroStateComponent;

  categories: string[] = ['election', 'population'];
  data: any;

  constructor(
    @Inject(COUNTY_PAINTING_STRATEGY) private paintStrategy: CountyPaintingStrategy,
    private topoService: TopoService,
    private strategySelect: UserSelectionService,
    private paintStrategyFactoryService: PaintStrategyFactoryService,
    private dataService: ChoroDataService
  ) {

  }

  ngOnInit(): void {

    this.topoService.getTopology();

    this.ChoroUSA.choroUSAEvent.subscribe(data => {
      console.log('USA', data);
      this.ChoroUSA.countyLayer.selectAll('path').style('fill', (d: any) => this.paintStrategy.getColor(d));
    })

    this.ChoroState.choroStateEvent.subscribe(data => {
      console.log('State', data);
      this.ChoroState.counties.selectAll('path').style('fill', (d: any) => this.paintStrategy.getColor(d));
    })
  }

  onValueChanged(event: any) {
    // Get the new value from the event argument
    console.log('%cEvent', 'color:yellow', event.value);

    const CurrentLevel = this.strategySelect.getSelection();
    this.strategySelect.setSelection(event.value);
    this.paintStrategy = this.paintStrategyFactoryService.createStrategy();
    // Handle the value change here
    this.data = this.paintStrategy.getData((fetchedData: any) => {
      console.log('fetched', fetchedData);
      this.paint(fetchedData);
    });
  }

  paint(fetchedData: any) {
    this.ChoroUSA.countyLayer.selectAll('path').style('fill', (d: any) => this.paintStrategy.getColor(d));
    this.ChoroState.counties.selectAll('path').style('fill', (d: any) => this.paintStrategy.getColor(d));
    console.log('fetched', fetchedData);
  }
}
