
import { Component, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { PAINTING_STRATEGY_TOKEN } from './jz-chorodash.module';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';
import { ChoroStateComponent } from '../jz-choropleths/components/choro-state/choro-state.component';
import { ChoroUsaComponent } from '../jz-choropleths/components/choro-usa/choro-usa.component';
import { UserSelectionService } from './paint-factory/services/user-selection.service';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { TopoService } from '../jz-choropleths/services/topo.service';
import { PopoverHttpErrorComponent } from '../jz-popups/popover-http-error/popover-http-error.component';
import { PopoverLoadingComponent } from '../jz-popups/popover-loading/popover-loading.component';

@Component({
  selector: 'app-jz-chorodash',
  templateUrl: './jz-chorodash.component.html',
  styleUrl: './jz-chorodash.component.css'
})
export class JzChorodashComponent implements OnInit {
  @HostBinding('class') classes = 'fit-to-parent grid-rows view-router-container';
  @ViewChild('choro_usa', { static: true }) ChoroUSA!: ChoroUsaComponent;
  @ViewChild('choro_state', { static: true }) ChoroState!: ChoroStateComponent;
  @ViewChild('popover_httperror', { static: true }) popover_httperror!: PopoverHttpErrorComponent;
  @ViewChild('popover_loading', { static: true }) popover_loading!: PopoverLoadingComponent;

  categories: string[] = ['election', 'population'];
  data: any;

  constructor(
    @Inject(PAINTING_STRATEGY_TOKEN) private paintStrategy: CountyPaintingStrategy,
    private topoService: TopoService,
    private strategySelect: UserSelectionService,
    private paintStrategyFactoryService: PaintStrategyFactoryService,
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
    console.log('%cEvent', 'color:yellow', event);

    const CurrentLevel = this.strategySelect.getSelection();
    this.strategySelect.setSelection(event.value);
    this.paintStrategy = this.paintStrategyFactoryService.createStrategy();
    // Handle the value change here
    this.data = this.paintStrategy.getData(this.popover_loading, this.popover_httperror, (fetchedData) => {
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
