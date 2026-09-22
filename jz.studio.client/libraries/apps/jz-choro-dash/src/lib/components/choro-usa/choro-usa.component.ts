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

import {
  geoAlbersUsa,
  geoCentroid,
  geoPath
} from 'd3-geo';

import { select } from 'd3-selection';
import { CountySelection } from '../../models/county-selection.model';
import { CountyLayerRenderer } from '../../models/county-layer-renderer.model';
import { CountyLayerSelection } from '../../models/county-layer-factory.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import { CountySelectionHighlighter } from '../../models/county-selection-highlighter.model';
import { CountyFeatureCollection } from '../../models/county-feature.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import { COUNTY_LAYER_RENDERER } from '../../services/county-layer-renderer.token';
import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { COUNTY_SELECTION_HIGHLIGHTER } from '../../services/county-selection-highlighter.token';
import { StateLookupService } from '../../services/state-lookup.service';

@Component({
  selector: 'choro-usa',
  imports: [],
  templateUrl: './choro-usa.component.html',
  styleUrls: ['./choro-usa.component.scss']
})

export class ChoroUsaComponent implements AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('USA', { static: true }) USA_Ref!: ElementRef;
  @Input() shapeSet?: GeoShapeSet;
  @Input() showCentroids = false;
  @Input() centroidMode: 'all' | 'hover' | 'none' = 'hover';
  @Input() selectedCountyId: string | null = null;
  @Output() choroUSAEvent = new EventEmitter<boolean>();
  @Output() countySelected = new EventEmitter<CountySelection>();

  private viewReady = false;
  private needsRender = true;
  private resizeObserver?: ResizeObserver;
  private resizeFrame?: number;

  width = 0;
  height = 0;

  private svg: any;
  private usaLayer: any;
  private stateLayer: any;
  public countyLayer!: CountyLayerSelection;
  private nationLayer: any;
  private stateTextLayer: any;

  private readonly geoPath = geoPath();

  constructor(
    @Inject(COUNTY_LAYER_RENDERER)
    private countyLayerRenderer: CountyLayerRenderer,
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    @Inject(COUNTY_SELECTION_HIGHLIGHTER)
    private countySelectionHighlighter: CountySelectionHighlighter,
    private stateLookup: StateLookupService
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
      this.applyCentroidDisplay();
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
    stateFeaturesCollection: any,
    countyFeaturesCollection: CountyFeatureCollection,
    stateMesh: any,
    nationMesh: any
  ): void {
    this.createChoroplethContainer();
    this.createCountyLayer(countyFeaturesCollection);
    this.createStateFeatureLayer(stateFeaturesCollection);
    this.createStatesMesh(stateMesh);
    this.createNationLayer(nationMesh);
    this.createStatesTextLayer(stateFeaturesCollection);
    this.createStateCentroidLayer(stateFeaturesCollection);
    this.applyCentroidDisplay();
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

  private createStateFeatureLayer(stateFeaturesCollection: any): void {
    this.stateLayer
      .selectAll('path.choro-state-feature')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('path')
      .attr('class', 'choro-state-feature')
      .attr('d', this.geoPath as any)
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('pointer-events', 'none');
  }

  private createStatesMesh(stateMesh: any): void {
    this.stateLayer
      .append('path')
      .datum(stateMesh)
      .attr('id', 'statemesh')
      .attr('class', 'choro-state-mesh')
      .attr('d', this.geoPath as any)
      .attr('pointer-events', 'none');
  }

  private createNationLayer(nationMesh: any): void {

    this.nationLayer
      .append('path')
      .datum(nationMesh)
      .attr('class', 'choro-nation-mesh')
      .attr('d', this.geoPath as any)
      .attr('pointer-events', 'none');
  }

  private projection = geoAlbersUsa();

  private getLatitudeTangentAngle(d: any): number {

    // geographic center of the state: [longitude, latitude]
    const [lon, lat] = geoCentroid(d);

    const delta = 0.5; // degrees of longitude to sample left/right

    const p1 = this.projection([lon - delta, lat]);
    const p2 = this.projection([lon + delta, lat]);

    if (!p1 || !p2) {
      return 0;
    }

    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];

    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  private createStatesTextLayer(stateFeaturesCollection: any): void {

    this.stateTextLayer
      .selectAll('text.state-label')
      .data(stateFeaturesCollection.features, (d: any) => d.id)
      .join('text')
      .attr('class', 'choro-usa-state-label')
      .attr('id', (d: any) => `state-label-${d.id}`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('x', (d: any) => this.geoPath.centroid(d)[0])
      .attr('y', (d: any) => this.geoPath.centroid(d)[1])
      .attr('transform', (d: any) => {
        const [x, y] = this.geoPath.centroid(d);

        const placement = this.stateLookup.statesDictionary[d.id];

        const rotate =
          (placement?.albersRotate ??
            this.getLatitudeTangentAngle(d)) * -1;

        return `rotate(${rotate}, ${x}, ${y})`;
      })

      .text((d: any) =>
        this.stateLookup.statesDictionary[d.id]?.stateName ?? ''
      );
  }

  private createStateCentroidLayer(stateFeaturesCollection: any): void {
    const centroidLayer = this.usaLayer
      .append('g')
      .attr('id', 'gStateCentroids')
      .attr('class', 'state-centroid-layer');
    // State geographic bounds
    centroidLayer
      .selectAll('rect.state-geo-bbox')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('rect')
      .attr('class', 'state-geo-bbox')
      .attr('data-state-id', (d: any) => d.id)
      .attr('x', (d: any) => this.geoPath.bounds(d)[0][0])
      .attr('y', (d: any) => this.geoPath.bounds(d)[0][1])
      .attr('width', (d: any) => this.geoPath.bounds(d)[1][0] - this.geoPath.bounds(d)[0][0])
      .attr('height', (d: any) => this.geoPath.bounds(d)[1][1] - this.geoPath.bounds(d)[0][1])
      .attr('fill', 'none')
      .attr('stroke', 'skyblue')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none');

    // Centroid dots
    centroidLayer
      .selectAll('circle.state-centroid')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('circle')
      .attr('class', 'state-centroid')
      .attr('cx', (d: any) => this.geoPath.centroid(d)[0])
      .attr('cy', (d: any) => this.geoPath.centroid(d)[1])
      .attr('r', 3)
      .attr('fill', 'skyblue')
      .attr('stroke', '#101820')
      .attr('stroke-width', 1);
  }

  private applyCentroidDisplay(): void {
    if (!this.usaLayer) {
      return;
    }

    const centroidLayer = this.usaLayer
      .select('g.state-centroid-layer');

    centroidLayer
      .style('display', this.showCentroids ? 'block' : 'none')
      .classed('centroid-mode-all', this.centroidMode === 'all')
      .classed('centroid-mode-hover', this.centroidMode === 'hover');

    centroidLayer
      .selectAll('rect.state-geo-bbox')
      .style('opacity', this.centroidMode === 'all' ? 0.85 : 0)
      .style('pointer-events', 'all');
  }

  private adjustGroupSizeAndPosition(): void {
    const usaBBox = this.usaLayer.node().getBBox();

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
