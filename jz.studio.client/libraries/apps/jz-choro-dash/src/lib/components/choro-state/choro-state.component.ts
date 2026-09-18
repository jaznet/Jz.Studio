// choro-state.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { select } from 'd3-selection';
import { geoPath } from 'd3-geo';

import { StateLookupService } from '../../services/state-lookup.service';

import { CountySelection } from '../../models/county-selection.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';

@Component({
  selector: 'choro-state',
  imports: [],
  templateUrl: './choro-state.component.html',
  styleUrls: ['./choro-state.component.scss']
})
export class ChoroStateComponent implements AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('US_state', { static: true }) stateRef!: ElementRef;
  @Input() stateId: string | null = null;
  @Input() shapeSet?: GeoShapeSet;
  @Input() selectedCountyId: string | null = null;
  @Output() choroStateEvent = new EventEmitter<boolean>();
  @Output() countySelected = new EventEmitter<CountySelection>();


 // private readonly stateFips = '34'; // New Jersey default, should be set by parent component input
  private viewReady = false;
  private resizeObserver?: ResizeObserver;
  private renderFrame?: number;

  width = 0;
  height = 0;

  svg: any;
  outerGroup: any;
  titleLayer: any;
  state: any;
  counties: any;

  constructor(
    private stateLookup: StateLookupService
  ) { }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.observeContainerSize();
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
    this.resizeObserver?.disconnect();

    if (this.renderFrame !== undefined) {
      cancelAnimationFrame(this.renderFrame);
    }
  }

  private observeContainerSize(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.scheduleStateChoropleth();
    });

    this.resizeObserver.observe(this.stateRef.nativeElement);
  }

  private scheduleStateChoropleth(): void {
    if (!this.viewReady) {
      return;
    }

    if (this.renderFrame !== undefined) {
      cancelAnimationFrame(this.renderFrame);
    }

    this.renderFrame = requestAnimationFrame(() => {
      this.renderFrame = undefined;
      this.tryCreateStateChoropleth();
    });
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

    console.log('%ctryCreateStateChoropleth - creating', 'color:#f7f9f9', {
      stateId: this.stateId,
      width: this.width,
      height: this.height
    });

    this.createStateChoropleth();
  }

  private createStateChoropleth(): void {

    const selectedStateFips =
      String(this.stateId ?? '34').padStart(2, '0');

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

    console.log('counties bbox', countyNode.getBBox());

  //  this.applyRotation();
  //  this.adjustStateGroupSizeAndPosition();
    this.fitAndTransformState();
    this.placeStateTitle();


    console.log('%ccreateStateChoropleth', 'color:#f7f9f9', {
      selectedStateFips,
      countyCount: selectedCountyFeatures.features.length
    });

    this.choroStateEvent.emit(true);
    console.log('%cemit', 'color:#f7f9f9');
  }

  private createStateChoroplethContainer(): void {
    console.log('%ccreateStateChoroplethContainer', 'color:#f7f9f9');

    select(this.stateRef.nativeElement)
      .selectAll('*')
      .remove();

    this.svg = select(this.stateRef.nativeElement)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('width', '100%')
      .style('height', '100%');

    this.outerGroup = this.svg
      .selectAll('g.state-outer-group')
      .data([null])
      .join('g')
      .attr('class', 'state-outer-group');

    this.titleLayer = this.svg
      .append('g')
      .attr('class', 'state-title-layer');

    this.state = this.outerGroup
      .selectAll('g.state-group')
      .data([null])
      .join('g')
      .attr('class', 'state-group');

    this.counties = this.state
      .selectAll('g.counties-group')
      .data([null])
      .join('g')
      .attr('class', 'counties-group');
  }

  private createCountyLayer(countyFeaturesCollection: any ): void {

    console.log('createCountyLayer');

    const geopath = geoPath();

    const stateCounties =
      countyFeaturesCollection.features;

    console.log(
      'state county count',
      stateCounties.length
    );

    this.counties
      .selectAll('path')
      .data(stateCounties, (d: any) => d.id)
      .join('path')
      .attr('d', geopath as any)
      .attr('fips', (d: any) => d.id)
      .attr('name', (d: any) => d.properties?.name)
      .attr('class', 'state-county-path')
      .attr('vector-effect', 'non-scaling-stroke')
      .on(
        'click',
        (_event: MouseEvent, countyFeature: any) =>
          this.onCountySelected(countyFeature)
      );
  }

  private onCountySelected(countyFeature: any): void {
    const countyId = String(countyFeature.id ?? '')
      .padStart(5, '0');

    const stateId = String(this.stateId ?? countyId.substring(0, 2))
      .padStart(2, '0');

    this.countySelected.emit({
      countyId,
      stateId,
      countyFeature
    });
  }

  private applyCountySelection(): void {
    if (!this.counties) {
      return;
    }

    const selectedCountyId = this.selectedCountyId
      ? String(this.selectedCountyId).padStart(5, '0')
      : null;

    this.counties
      .selectAll('path.state-county-path')
      .classed('is-selected', (county: any) =>
        selectedCountyId !== null &&
        String(county.id ?? '').padStart(5, '0') === selectedCountyId
      );
  }

  private createStateOutlineLayer(countyFeaturesCollection: any): void {
    const geopath = geoPath();

    this.state
      .append('path')
      .datum(countyFeaturesCollection)
      .attr('class', 'choro-state-mesh')
      .attr('d', geopath as any)
      .attr('pointer-events', 'none');
  }

  private fitAndTransformState(): void {
    const stateNode = this.state?.node();

    if (!stateNode) {
      return;
    }

    const selectedStateFips =
      String(this.stateId ?? '34').padStart(2, '0');

    const rotationAngle =
      this.stateLookup.statesDictionary[selectedStateFips]?.albersRotate ?? 0;

    this.outerGroup.attr('transform', null);
    this.state.attr('transform', null);

    const unrotatedBounds = stateNode.getBBox();

    if (unrotatedBounds.width <= 0 || unrotatedBounds.height <= 0) {
      return;
    }

    const centerX = unrotatedBounds.x + unrotatedBounds.width / 2;
    const centerY = unrotatedBounds.y + unrotatedBounds.height / 2;

    this.state.attr(
      'transform',
      `rotate(${rotationAngle}, ${centerX}, ${centerY})`
    );

    const rotatedBounds = this.getRenderedStateBounds(stateNode);

    if (!rotatedBounds || rotatedBounds.width <= 0 || rotatedBounds.height <= 0) {
      return;
    }

    const padding = 0;

    const availableWidth = this.width - padding * 2;
    const availableHeight = this.height - padding * 2;

    const scaleX = availableWidth / rotatedBounds.width;
    const scaleY = availableHeight / rotatedBounds.height;

    const scale = Math.min(scaleX, scaleY);

    const tx =
      padding +
      (availableWidth - rotatedBounds.width * scale) / 2 -
      rotatedBounds.x * scale;

    const ty =
      padding +
      (availableHeight - rotatedBounds.height * scale) / 2 -
      rotatedBounds.y * scale;

    this.outerGroup.attr(
      'transform',
      `translate(${tx}, ${ty}) scale(${scale})`
    );
  }

  private getRenderedStateBounds(
    stateNode: SVGGraphicsElement
  ): { x: number; y: number; width: number; height: number } | null {
    const svgNode = this.svg?.node() as SVGSVGElement | null;

    if (!svgNode) {
      return null;
    }

    const svgScreenMatrix = svgNode.getScreenCTM();

    if (!svgScreenMatrix) {
      return null;
    }

    const inverseSvgScreenMatrix = svgScreenMatrix.inverse();
    const paths = Array.from(
      stateNode.querySelectorAll<SVGPathElement>('path')
    );

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    paths.forEach(pathNode => {
      const pathScreenMatrix = pathNode.getScreenCTM();

      if (!pathScreenMatrix) {
        return;
      }

      const pathLength = pathNode.getTotalLength();
      const sampleCount = Math.max(
        2,
        Math.min(4096, Math.ceil(pathLength))
      );

      for (let index = 0; index <= sampleCount; index += 1) {
        const pathPoint = pathNode.getPointAtLength(
          pathLength * index / sampleCount
        );
        const screenPoint = pathPoint.matrixTransform(pathScreenMatrix);
        const svgPoint = screenPoint.matrixTransform(inverseSvgScreenMatrix);

        minX = Math.min(minX, svgPoint.x);
        minY = Math.min(minY, svgPoint.y);
        maxX = Math.max(maxX, svgPoint.x);
        maxY = Math.max(maxY, svgPoint.y);
      }
    });

    if (
      !Number.isFinite(minX) ||
      !Number.isFinite(minY) ||
      !Number.isFinite(maxX) ||
      !Number.isFinite(maxY)
    ) {
      return null;
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
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

  private adjustStateGroupSizeAndPosition(): void {
    const countyNode = this.counties?.node();

    if (!countyNode) {
      return;
    }

    const bbox = countyNode.getBBox();

    if (bbox.width <= 0 || bbox.height <= 0) {
      return;
    }

    const padding = 0;

    const availableWidth = this.width - padding * 2;
    const availableHeight = this.height - padding * 2;

    const scaleX = availableWidth / bbox.width;
    const scaleY = availableHeight / bbox.height;

    const scale = Math.min(scaleX, scaleY);

    const tx =
      padding +
      (availableWidth - bbox.width * scale) / 2 -
      bbox.x * scale;

    const ty =
      padding +
      (availableHeight - bbox.height * scale) / 2 -
      bbox.y * scale;

    this.outerGroup.attr(
      'transform',
      `translate(${tx}, ${ty}) scale(${scale})`
    );
  }

  private applyRotation(): void {
    const selectedStateFips = String(this.stateId ?? '34').padStart(2, '0');
    const rotationAngle =
      this.stateLookup.statesDictionary[selectedStateFips]?.albersRotate || 0;

    this.outerGroup.attr(
      'transform',
      `rotate(${rotationAngle}, ${this.width / 2}, ${this.height / 2})`
    );
  }
}
