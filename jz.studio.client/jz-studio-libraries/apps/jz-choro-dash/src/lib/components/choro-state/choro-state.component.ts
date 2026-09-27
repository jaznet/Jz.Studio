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
import { COUNTY_SELECTION_HIGHLIGHTER } from '../../services/county-selection-highlighter.token';
import { ResponsiveRenderScheduler } from '../../services/responsive-render-scheduler.service';
import { StateLayerRendererService } from '../../services/state-layer-renderer.service';
import { StateTitleRendererService } from '../../services/state-title-renderer.service';
import { StateViewportFitterService } from '../../services/state-viewport-fitter.service';

import { CountySelection } from '../../models/county-selection.model';
import { CountyLayerSelection } from '../../models/county-layer-factory.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import {
  CountyFeature
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
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    private stateLayerRenderer: StateLayerRendererService,
    private stateTitleRenderer: StateTitleRendererService,
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

    const layers = this.stateLayerRenderer.render({
      host: this.stateRef.nativeElement,
      width: this.width,
      height: this.height,
      shapeSet: this.shapeSet!,
      onCountySelected: countyFeature =>
        this.onCountySelected(countyFeature)
    });

    this.svg = layers.svg;
    this.outerGroup = layers.outerGroup;
    this.titleLayer = layers.titleLayer;
    this.state = layers.stateLayer;
    this.counties = layers.countyLayer;

    this.applyCountySelection();

    const countyNode = this.counties?.node();

    if (!countyNode) {
      return;
    }

    this.fitAndTransformState();
    this.placeStateTitle();

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

    this.countySelectionHighlighter.apply(
      this.counties,
      'path.state-county-path',
      this.selectedCountyId
    );
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
    this.stateTitleRenderer.render(
      this.titleLayer,
      this.stateId,
      this.width
    );
  }

}
