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
import { StateRenderRequestFactoryService } from '../../services/state-render-request-factory.service';
import { STATE_RENDERER } from '../../services/state-renderer.token';

import { CountySelection } from '../../models/county-selection.model';
import { CountyLayerSelection } from '../../models/county-layer-factory.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import {
  CountyFeature
} from '../../models/county-feature.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import { StateRenderer } from '../../models/state-renderer.model';

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

  counties!: CountyLayerSelection;

  constructor(
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    @Inject(STATE_RENDERER)
    private stateRenderer: StateRenderer,
    private stateRenderRequestFactory: StateRenderRequestFactoryService
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

    const request = this.stateRenderRequestFactory.create({
      host: this.stateRef.nativeElement,
      stateId: this.stateId,
      shapeSet: this.shapeSet,
      selectedCountyId: this.selectedCountyId,
      onCountySelected: countyFeature =>
        this.onCountySelected(countyFeature)
    });

    if (!request) {
      return;
    }

    const countyLayer = this.stateRenderer.render(request);

    if (!countyLayer) {
      return;
    }

    this.counties = countyLayer;

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
    if (!this.counties) {
      return;
    }

    this.stateRenderer.applyCountySelection(
      this.counties,
      this.selectedCountyId
    );
  }

}
