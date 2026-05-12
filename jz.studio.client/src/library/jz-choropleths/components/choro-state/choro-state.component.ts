// choro-state.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

import { select } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { Subscription } from 'rxjs';
import { feature } from 'topojson-client';

import { StateLookupService } from '../../services/state-lookup.service';
import { TopoService } from '../../services/topo.service';
import { CountyDataService } from '../../services/county-data.service';
import {
  CountyPaintingStrategy,
  COUNTY_PAINTING_STRATEGY
} from '../../interface/county-painting-strategy.token';

@Component({
  selector: 'choro-state',
  imports: [],
  templateUrl: './choro-state.component.html',
  styleUrls: ['./choro-state.component.css']
})
export class ChoroStateComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('US_state', { static: true }) stateRef!: ElementRef;
  @Output() choroStateEvent = new EventEmitter<any>();

  private topologySubscription?: Subscription;

  private readonly stateFips = '13'; // Georgia

  width = 0;
  height = 0;

  svg: any;
  outerGroup: any;
  state: any;
  counties: any;

  constructor(
    @Inject(COUNTY_PAINTING_STRATEGY)
    private paintingStrategy: CountyPaintingStrategy,
    private countyDataService: CountyDataService,
    private topoService: TopoService,
    private stateLookup: StateLookupService
  ) { }

  ngAfterViewInit(): void {
    this.width = this.stateRef.nativeElement.clientWidth - 2;
    this.height = this.stateRef.nativeElement.clientHeight - 2;

    this.topologySubscription = this.topoService.getTopology().subscribe(topo => {
      const countyFeaturesCollection = feature(
        topo as any,
        topo.objects['counties']
      ) as any;

      this.createStateChoropleth(countyFeaturesCollection);
    });
  }

  ngOnDestroy(): void {
    this.topologySubscription?.unsubscribe();
  }

  private createStateChoropleth(countyFeaturesCollection: any): void {
    this.createStateChoroplethContainer();
    this.createCountyLayer(countyFeaturesCollection);

    console.log('state bbox', this.state.node().getBBox());
    console.log('counties bbox', this.counties.node().getBBox());

    this.adjustStateGroupSizeAndPosition();
    this.applyRotation();

    this.choroStateEvent.emit(true);
  }

  private createStateChoroplethContainer(): void {
    select(this.stateRef.nativeElement).selectAll('*').remove();

    this.svg = select(this.stateRef.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.outerGroup = this.svg
      .append('g')
      .attr('id', 'outer-group');

    this.state = this.outerGroup
      .append('g')
      .attr('id', 'state');

    this.counties = this.state
      .append('g')
      .attr('id', 'counties');
  }

  private createCountyLayer(countyFeaturesCollection: any): void {
    const geopath = geoPath();

    const stateCounties = countyFeaturesCollection.features.filter((d: any) =>
      String(d.id).slice(0, 2) === this.stateFips
    );

    console.log('state county count', stateCounties.length);

    this.counties
      .selectAll('path')
      .data(stateCounties)
      .enter()
      .append('path')
      .attr('d', geopath)
      .attr('fips', (d: any) => d.id)
      .attr('name', (d: any) => d.properties?.name)
      .attr('class', 'state-county-path')
      .style('stroke', 'black')
      .style('stroke-width', '.2')
      .style('fill', 'pink');
  }

  private adjustStateGroupSizeAndPosition(): void {
    const stateBBox = this.state.node().getBBox();

    if (!stateBBox.width || !stateBBox.height) {
      console.warn('State bbox is empty', stateBBox);
      return;
    }

    const padding = 20;

    const availableWidth = this.width - padding * 2;
    const availableHeight = this.height - padding * 2;

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
