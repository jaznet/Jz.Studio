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

import { select } from 'd3-selection';
import { geoPath } from 'd3-geo';

import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { COUNTY_SELECTION_HIGHLIGHTER } from '../../services/county-selection-highlighter.token';
import { COUNTY_LAYER_RENDERER } from '../../services/county-layer-renderer.token';
import { ResponsiveRenderScheduler } from '../../services/responsive-render-scheduler.service';
import { StateViewportFitterService } from '../../services/state-viewport-fitter.service';
import { StateLookupService } from '../../services/state-lookup.service';

import { CountySelection } from '../../models/county-selection.model';
import { CountyLayerRenderer } from '../../models/county-layer-renderer.model';
import { CountyLayerSelection } from '../../models/county-layer-factory.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import {
  CountyFeature,
  CountyFeatureCollection
} from '../../models/county-feature.model';
import { CountySelectionHighlighter } from '../../models/county-selection-highlighter.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import {
  SvgCanvasSelection,
  SvgGroupSelection
} from '../../models/svg-layer-selection.model';

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

  width = 0;
  height = 0;

  svg!: SvgCanvasSelection;
  outerGroup!: SvgGroupSelection;
  titleLayer!: SvgGroupSelection;
  state!: SvgGroupSelection;
  counties!: CountyLayerSelection;

  constructor(
    @Inject(COUNTY_LAYER_RENDERER)
    private countyLayerRenderer: CountyLayerRenderer,
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    private stateLookup: StateLookupService,
    private stateViewportFitter: StateViewportFitterService
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

    if (!this.stateId) {
      return;
    }

    if (!this.shapeSet?.features?.features?.length) {
      return;
    }

    const rect = this.stateRef.nativeElement.getBoundingClientRect();

    this.width = Math.max(0, Math.floor(rect.width));
    this.height = Math.max(0, Math.floor(rect.height));

    if (this.width <= 0 || this.height <= 0) {
      console.warn('State choropleth skipped: invalid size', {
        width: this.width,
        height: this.height
      });

      return;
    }

    this.createStateChoropleth();
  }

  private createStateChoropleth(): void {

    const selectedCountyFeatures = this.shapeSet!.features;
    const stateOutline =
      this.shapeSet!.outline ?? selectedCountyFeatures;

    this.createStateChoroplethContainer();
    this.createCountyLayer(selectedCountyFeatures);
    this.applyCountySelection();
    this.createStateOutlineLayer(stateOutline);

    const countyNode = this.counties?.node();

    if (!countyNode) {
      return;
    }

    this.fitAndTransformState();
    this.placeStateTitle();

    this.choroStateEvent.emit(true);
  }

  private createStateChoroplethContainer(): void {
    select(this.stateRef.nativeElement)
      .selectAll('*')
      .remove();

    this.svg = select(this.stateRef.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('width', '100%')
      .style('height', '100%');

    this.outerGroup = this.svg
      .append('g')
      .attr('class', 'state-outer-group');

    this.titleLayer = this.svg
      .append('g')
      .attr('class', 'state-title-layer');

    this.state = this.outerGroup
      .append('g')
      .attr('class', 'state-group');

    this.counties = this.state
      .append('g')
      .attr('class', 'counties-group');
  }

  private createCountyLayer(
    countyFeaturesCollection: CountyFeatureCollection
  ): void {
    this.countyLayerRenderer.render(
      {
        countyLayer: this.counties,
        countyFeaturesCollection,
        pathClass: 'state-county-path',
        gesture: 'primary-pointer',
        onCountySelected: countyFeature =>
          this.onCountySelected(countyFeature)
      }
    );
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

    this.countySelectionHighlighter.apply(
      this.counties,
      'path.state-county-path',
      this.selectedCountyId
    );
  }

  private createStateOutlineLayer(
    countyFeaturesCollection: CountyFeatureCollection
  ): void {
    const geopath = geoPath();

    this.state
      .append('path')
      .datum(countyFeaturesCollection)
      .attr('class', 'choro-state-mesh')
      .attr('d', geopath)
      .attr('pointer-events', 'none');
  }

  private fitAndTransformState(): void {
    this.stateViewportFitter.fit({
      svg: this.svg,
      outerGroup: this.outerGroup,
      stateGroup: this.state,
      stateId: this.stateId,
      width: this.width,
      height: this.height
    });
  }

  private placeStateTitle(): void {
    const selectedStateFips = String(this.stateId ?? '34').padStart(2, '0');

    const stateName =
      this.stateLookup.statesDictionary[selectedStateFips]?.stateName ?? '';

    this.titleLayer
      .selectAll('text.state-title')
      .data([stateName])
      .join('text')
      .attr('class', 'state-title')
      .attr('x', this.width - 24)
      .attr('y', 36)
      .attr('text-anchor', 'end')
      .text(stateName);
  }

}
