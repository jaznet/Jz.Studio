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

import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { ResponsiveRenderScheduler } from '../../services/responsive-render-scheduler.service';
import { StateRenderCoordinatorService } from '../../services/state-render-coordinator.service';

import { CountySelection } from '../../models/county-selection.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import {
  CountyFeature
} from '../../models/county-feature.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import {
  StateRenderHandle
} from '../../models/state-renderer.model';

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
  private readonly renderScheduler = new ResponsiveRenderScheduler(
    () => this.tryCreateStateChoropleth()
  );

  private renderHandle?: StateRenderHandle;

  constructor(
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    private stateRenderCoordinator: StateRenderCoordinatorService
  ) { }

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
