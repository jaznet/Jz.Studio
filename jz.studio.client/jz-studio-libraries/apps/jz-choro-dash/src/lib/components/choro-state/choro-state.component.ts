// choro-state.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { CountySelection } from '../../models/county-selection.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import { ResponsiveRenderSchedulerFactory } from '../../models/factories/responsive-render-scheduler-factory.model';
import {
  CountyFeature
} from '../../models/county-feature.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import { RenderScheduler } from '../../models/responsive-render-scheduler.model';
import { StateRenderCoordinator } from '../../models/state-render-coordinator.model';
import {
  StateRenderHandle
} from '../../models/state-renderer.model';
import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { RESPONSIVE_RENDER_SCHEDULER_FACTORY } from '../../services/factories/responsive-render-scheduler-factory.token';
import { STATE_RENDER_COORDINATOR } from '../../services/state-render-coordinator.token';

@Component({
  selector: 'choro-state',
  imports: [],
  templateUrl: './choro-state.component.html',
  styleUrls: ['./choro-state.component.scss']
})
export class ChoroStateComponent implements AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('US_state', { static: true })
  stateRef!: ElementRef<HTMLElement>;
  @Input() stateId: string | null = null;
  @Input() shapeSet?: GeoShapeSet;
  @Input() selectedCountyId: string | null = null;
  @Output() choroStateEvent = new EventEmitter<boolean>();
  @Output() countySelected = new EventEmitter<CountySelection>();

  private viewReady = false;
  private readonly renderScheduler: RenderScheduler;

  private renderHandle?: StateRenderHandle;

  constructor(
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    @Inject(STATE_RENDER_COORDINATOR)
    private stateRenderCoordinator: StateRenderCoordinator,
    @Inject(RESPONSIVE_RENDER_SCHEDULER_FACTORY)
    renderSchedulerFactory: ResponsiveRenderSchedulerFactory
  ) {
    this.renderScheduler = renderSchedulerFactory.create(
      () => this.tryCreateStateChoropleth()
    );
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderScheduler.observe(this.stateRef.nativeElement);
    this.scheduleStateChoropleth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shapeSet'] || changes['stateId']) {
      this.scheduleStateChoropleth();
    }

    if (changes['selectedCountyId']) {
      this.applyCountySelection();
    }
  }

  ngOnDestroy(): void {
    this.renderScheduler.destroy();
  }

  private scheduleStateChoropleth(): void {
    if (!this.viewReady) {
      return;
    }

    this.renderScheduler.schedule();
  }

  private tryCreateStateChoropleth(): void {

    if (!this.viewReady) {
      return;
    }

    const renderHandle = this.stateRenderCoordinator.render({
      host: this.stateRef.nativeElement,
      stateId: this.stateId,
      shapeSet: this.shapeSet,
      selectedCountyId: this.selectedCountyId,
      onCountySelected: countyFeature =>
        this.onCountySelected(countyFeature)
    });

    if (!renderHandle) {
      return;
    }

    this.renderHandle = renderHandle;

    this.choroStateEvent.emit(true);
  }

  private onCountySelected(countyFeature: CountyFeature): void {
    this.countySelectionDispatcher.dispatch(
      this.countySelected,
      countyFeature,
      this.stateId
    );
  }

  private applyCountySelection(): void {
    this.renderHandle?.applyCountySelection(this.selectedCountyId);
  }

}
