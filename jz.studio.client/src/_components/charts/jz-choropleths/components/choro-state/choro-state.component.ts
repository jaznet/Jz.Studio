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
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { select } from 'd3-selection';
import { geoPath } from 'd3-geo';

import { StateLookupService } from '../../services/state-lookup.service';
import {
  CountyPaintingStrategy,
  COUNTY_PAINTING_STRATEGY
} from '../../interface/county-painting-strategy.token';
import { GeoShapeSet } from '../../models/geo-shape-set.model';

@Component({
  selector: 'choro-state',
  imports: [],
  templateUrl: './choro-state.component.html',
  styleUrls: ['./choro-state.component.scss']
})
export class ChoroStateComponent implements AfterViewInit, OnChanges {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('US_state', { static: true }) stateRef!: ElementRef;
  @Input() stateId: string | null = null;
  @Input() shapeSet?: GeoShapeSet;
  @Output() choroStateEvent = new EventEmitter<any>();


 // private readonly stateFips = '34'; // New Jersey default, should be set by parent component input
  private viewReady = false;

  width = 0;
  height = 0;

  svg: any;
  outerGroup: any;
  titleLayer: any;
  state: any;
  counties: any;

  constructor(
    @Inject(COUNTY_PAINTING_STRATEGY)
    private paintingStrategy: CountyPaintingStrategy,
    private stateLookup: StateLookupService
  ) { }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryCreateStateChoropleth();
    // Let Angular/layout finish one more pass before measuring.
    //queueMicrotask(() => this.tryCreateStateChoropleth());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shapeSet'] || changes['stateId']) {
      this.tryCreateStateChoropleth();
    }
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

    const selectedCountyFeatures = {
      type: 'FeatureCollection',
      features: this.shapeSet!.features.features.filter((county: any) => {
        const countyFips = String(county.id).padStart(5, '0');
        return countyFips.substring(0, 2) === selectedStateFips;
      })
    };

    if (!selectedCountyFeatures.features.length) {
      console.warn('No counties found for selected state', {
        selectedStateFips,
        stateId: this.stateId
      });

      return;
    }

    this.createStateChoroplethContainer();
    this.createCountyLayer(selectedCountyFeatures);

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
      .attr('vector-effect', 'non-scaling-stroke');
  }

  private fitAndTransformState(): void {
    const countyNode = this.counties?.node();

    if (!countyNode) {
      return;
    }

    const bbox = countyNode.getBBox();

    if (bbox.width <= 0 || bbox.height <= 0) {
      return;
    }

    const selectedStateFips =
      String(this.stateId ?? '34').padStart(2, '0');

    const rotationAngle =
      this.stateLookup.statesDictionary[selectedStateFips]?.albersRotate ?? 0;

    const padding = 6;

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

    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    this.outerGroup.attr(
      'transform',
      `
      translate(${tx}, ${ty})
      scale(${scale})
      rotate(${rotationAngle}, ${cx}, ${cy})
    `
    );
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
