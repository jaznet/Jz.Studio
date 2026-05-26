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


  private readonly stateFips = '34'; // New Jersey default, should be set by parent component input
  private viewReady = false;

  width = 0;
  height = 0;

  svg: any;
  outerGroup: any;
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


    this.createStateChoroplethContainer();
    this.createCountyLayer();

    const countyNode = this.counties?.node();

    if (!countyNode) {
      return;
    }

    console.log('counties bbox', countyNode.getBBox());

    this.adjustStateGroupSizeAndPosition();
    this.applyRotation();

    console.log('%ccreateStateChoropleth', 'color:#f7f9f9');
    this.choroStateEvent.emit(true);
    console.log('%cemit', 'color:#f7f9f9');
  }

  private createStateChoroplethContainer(): void {
    console.log('%ccreateStateChoroplethContainer','color:#f7f9f9');
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

  private createCountyLayer(): void {
    console.log('createCountyLayer');
    const geopath = geoPath();

    const stateCounties = this.shapeSet!.features.features;

    console.log('state county count', stateCounties.length);

    this.counties
      .selectAll('path')
      .data(stateCounties, (d: any) => d.id)
      .join('path')
      .attr('d', geopath as any)
      .attr('fips', (d: any) => d.id)
      .attr('name', (d: any) => d.properties?.name)
      .attr('class', 'state-county-path')
      .style('stroke', 'black')
      .style('stroke-width', '.5')
      .style('fill', 'var(--choro-state-county-fill)');
  }

  private adjustStateGroupSizeAndPosition(): void {
    const stateBBox = this.state.node().getBBox();

    if (!stateBBox.width || !stateBBox.height) {
      console.warn('State bbox is empty', stateBBox);
      return;
    }

    const padding = 20;

    const availableWidth = Math.max(0, this.width - padding * 2);
    const availableHeight = Math.max(0, this.height - padding * 2);

    if (availableWidth <= 0 || availableHeight <= 0) {
      return;
    }

    const scaleX = availableWidth / stateBBox.width;
    const scaleY = availableHeight / stateBBox.height;
    const scale = Math.min(scaleX, scaleY);

    const translateX =
      (this.width - stateBBox.width * scale) / 2 - stateBBox.x * scale;

    const translateY =
      (this.height - stateBBox.height * scale) / 2 - stateBBox.y * scale;

    this.state.attr(
      'transform',
      `translate(${translateX}, ${translateY}) scale(${scale})`
    );
  }

  private applyRotation(): void {
    const rotationAngle =
      this.stateLookup.statesDictionary[this.stateFips]?.albersRotate || 0;

    this.outerGroup.attr(
      'transform',
      `rotate(${rotationAngle}, ${this.width / 2}, ${this.height / 2})`
    );
  }
}
