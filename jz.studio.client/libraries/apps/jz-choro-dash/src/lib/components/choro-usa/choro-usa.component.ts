// choro-usa.component.ts

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

import { geoPath } from 'd3-geo';

import { select } from 'd3-selection';
import { CountySelection } from '../../models/county-selection.model';
import { CountyLayerRenderer } from '../../models/county-layer-renderer.model';
import { CountyLayerSelection } from '../../models/county-layer-factory.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import { CountySelectionHighlighter } from '../../models/county-selection-highlighter.model';
import { CountyFeatureCollection } from '../../models/county-feature.model';
import {
  SvgCanvasSelection,
  SvgGroupSelection
} from '../../models/svg-layer-selection.model';
import {
  StateBoundaryGeometry,
  StateFeatureCollection
} from '../../models/state-feature.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import { StateCentroidMode } from '../../models/state-centroid-mode.model';
import { COUNTY_LAYER_RENDERER } from '../../services/county-layer-renderer.token';
import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { COUNTY_SELECTION_HIGHLIGHTER } from '../../services/county-selection-highlighter.token';
import { StateCentroidRendererService } from '../../services/state-centroid-renderer.service';
import { StateLabelRendererService } from '../../services/state-label-renderer.service';

@Component({
  selector: 'choro-usa',
  imports: [],
  templateUrl: './choro-usa.component.html',
  styleUrls: ['./choro-usa.component.scss']
})

export class ChoroUsaComponent implements AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('USA', { static: true })
  USA_Ref!: ElementRef<HTMLElement>;
  @Input() shapeSet?: GeoShapeSet;
  @Input() showCentroids = false;
  @Input() centroidMode: StateCentroidMode = 'hover';
  @Input() selectedCountyId: string | null = null;
  @Output() choroUSAEvent = new EventEmitter<boolean>();
  @Output() countySelected = new EventEmitter<CountySelection>();

  private viewReady = false;
  private needsRender = true;
  private resizeObserver?: ResizeObserver;
  private resizeFrame?: number;

  width = 0;
  height = 0;

  private svg!: SvgCanvasSelection;
  private usaLayer!: SvgGroupSelection;
  private stateLayer!: SvgGroupSelection;
  public countyLayer!: CountyLayerSelection;
  private nationLayer!: SvgGroupSelection;
  private stateTextLayer!: SvgGroupSelection;

  private readonly geoPath = geoPath();

  constructor(
    @Inject(COUNTY_LAYER_RENDERER)
    private countyLayerRenderer: CountyLayerRenderer,
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    private stateCentroidRenderer: StateCentroidRendererService,
    private stateLabelRenderer: StateLabelRendererService
  ) { }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.observeContainerSize();
    this.scheduleLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shapeSet']) {
      this.needsRender = true;
      this.scheduleLayout();
    }

    if (changes['showCentroids'] || changes['centroidMode']) {
      this.applyCentroidPresentation();
    }

    if (changes['selectedCountyId']) {
      this.applyCountySelection();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();

    if (this.resizeFrame !== undefined) {
      cancelAnimationFrame(this.resizeFrame);
    }
  }

  private observeContainerSize(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleLayout();
    });

    this.resizeObserver.observe(this.USA_Ref.nativeElement);
  }

  private scheduleLayout(): void {
    if (!this.viewReady) {
      return;
    }

    if (this.resizeFrame !== undefined) {
      cancelAnimationFrame(this.resizeFrame);
    }

    this.resizeFrame = requestAnimationFrame(() => {
      this.resizeFrame = undefined;
      this.layoutChoropleth();
    });
  }

  private layoutChoropleth(): void {
    const bounds = this.USA_Ref.nativeElement
      .getBoundingClientRect();

    const nextWidth = Math.max(0, Math.floor(bounds.width));
    const nextHeight = Math.max(0, Math.floor(bounds.height));

    if (nextWidth <= 0 || nextHeight <= 0) {
      return;
    }

    this.width = nextWidth;
    this.height = nextHeight;

    if (!this.usaLayer || this.needsRender) {
      this.tryCreateChoropleth();
      return;
    }

    this.svg.attr('viewBox', `0 0 ${this.width} ${this.height}`);
    this.adjustGroupSizeAndPosition();
  }

  private tryCreateChoropleth(): void {
    if (!this.viewReady) {
      return;
    }

    const shapeSet = this.shapeSet;

    if (
      !shapeSet?.features?.features?.length ||
      !shapeSet.detailFeatures?.features?.length ||
      !shapeSet.mesh ||
      !shapeSet.outline
    ) {
      return;
    }

    this.createChoropleth(
      shapeSet.features,
      shapeSet.detailFeatures,
      shapeSet.mesh,
      shapeSet.outline
    );
  }

  private createChoropleth(
    stateFeaturesCollection: StateFeatureCollection,
    countyFeaturesCollection: CountyFeatureCollection,
    stateMesh: StateBoundaryGeometry,
    nationMesh: StateBoundaryGeometry
  ): void {
    this.createChoroplethContainer();
    this.createCountyLayer(countyFeaturesCollection);
    this.createStateFeatureLayer(stateFeaturesCollection);
    this.createStatesMesh(stateMesh);
    this.createNationLayer(nationMesh);
    this.stateLabelRenderer.render(
      this.stateTextLayer,
      stateFeaturesCollection
    );
    this.stateCentroidRenderer.render(
      this.usaLayer,
      stateFeaturesCollection
    );
    this.applyCentroidPresentation();
    this.applyCountySelection();
    this.adjustGroupSizeAndPosition();
    this.needsRender = false;

    this.choroUSAEvent.emit(true);
  }

  private createChoroplethContainer(): void {
    select(this.USA_Ref.nativeElement).selectAll('*').remove();

    this.svg = select(this.USA_Ref.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('width', '100%')
      .style('height', '100%');

    this.usaLayer = this.svg.append('g').attr('id', 'usa');

    this.countyLayer = this.usaLayer.append('g').attr('id', 'county-layer');
    this.stateLayer = this.usaLayer.append('g').attr('id', 'state-layer');
    this.nationLayer = this.usaLayer.append('g').attr('id', 'nation-layer');
    this.stateTextLayer = this.usaLayer.append('g').attr('id', 'state-name-layer');
  }

  private createCountyLayer(
    countyFeaturesCollection: CountyFeatureCollection
  ): void {
    this.countyLayerRenderer.render(
      {
        countyLayer: this.countyLayer,
        countyFeaturesCollection,
        pathClass: 'choro-county-path',
        gesture: 'click',
        onCountySelected: countyFeature =>
          this.countySelectionDispatcher.dispatch(
            this.countySelected,
            countyFeature
          ),
        includeTitle: true
      }
    );
  }

  private applyCountySelection(): void {
    if (!this.countyLayer) {
      return;
    }

    this.countySelectionHighlighter.apply(
      this.countyLayer,
      'path.choro-county-path',
      this.selectedCountyId
    );
  }

  private createStateFeatureLayer(
    stateFeaturesCollection: StateFeatureCollection
  ): void {
    this.stateLayer
      .selectAll('path.choro-state-feature')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('path')
      .attr('class', 'choro-state-feature')
      .attr('d', this.geoPath)
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('pointer-events', 'none');
  }

  private createStatesMesh(stateMesh: StateBoundaryGeometry): void {
    this.stateLayer
      .append('path')
      .datum(stateMesh)
      .attr('id', 'statemesh')
      .attr('class', 'choro-state-mesh')
      .attr('d', this.geoPath)
      .attr('pointer-events', 'none');
  }

  private createNationLayer(nationMesh: StateBoundaryGeometry): void {

    this.nationLayer
      .append('path')
      .datum(nationMesh)
      .attr('class', 'choro-nation-mesh')
      .attr('d', this.geoPath)
      .attr('pointer-events', 'none');
  }

  private applyCentroidPresentation(): void {
    if (!this.usaLayer) {
      return;
    }

    this.stateCentroidRenderer.applyDisplay(
      this.usaLayer,
      this.showCentroids,
      this.centroidMode
    );
  }

  private adjustGroupSizeAndPosition(): void {
    const usaNode = this.usaLayer.node();

    if (!usaNode) {
      return;
    }

    const usaBBox = usaNode.getBBox();

    if (!usaBBox.width || !usaBBox.height) {
      console.warn('USA bbox is empty', usaBBox);
      return;
    }

    const scaleX = this.width / usaBBox.width;
    const scaleY = this.height / usaBBox.height;
    const scale = Math.min(scaleX, scaleY);

    const translateX =
      (this.width - usaBBox.width * scale) / 2 - usaBBox.x * scale;

    const translateY =
      (this.height - usaBBox.height * scale) / 2 - usaBBox.y * scale;

    this.usaLayer.attr(
      'transform',
      `translate(${translateX}, ${translateY}) scale(${scale})`
    );
  }
}
