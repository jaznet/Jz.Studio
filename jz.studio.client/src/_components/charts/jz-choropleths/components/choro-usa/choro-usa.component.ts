// choro-usa.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

import { select } from 'd3-selection';
import { geoPath } from 'd3-geo';
import { Subscription } from 'rxjs';
import { feature, mesh } from 'topojson-client';

import { TopoService } from '../../services/topo.service';
import { StateLookupService } from '../../services/state-lookup.service';
import { CountyDataService } from '../../services/county-data.service';
import {
  CountyPaintingStrategy,
  COUNTY_PAINTING_STRATEGY
} from '../../interface/county-painting-strategy.token';
import { geoCentroid, geoAlbersUsa } from 'd3-geo';
import { GeoShapeSet } from '../../models/geo-shape-set.model';

@Component({
  selector: 'choro-usa',
  imports: [],
  templateUrl: './choro-usa.component.html',
  styleUrls: ['./choro-usa.component.scss']
})

export class ChoroUsaComponent implements AfterViewInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('USA', { static: true }) USA_Ref!: ElementRef;
  @Input() shapeSet?: GeoShapeSet;
  @Output() choroUSAEvent = new EventEmitter<any>();

  private topologySubscription?: Subscription;

  width = 0;
  height = 0;

  private svg: any;
  private usa: any;
  private stateLayer: any;
  public countyLayer: any;
  private nationLayer: any;
  private stateTextLayer: any;

  private readonly geoPath = geoPath();

  private countyPaintingStrategy =
    inject<CountyPaintingStrategy>(COUNTY_PAINTING_STRATEGY);

  private countyDataService = inject(CountyDataService);
  private topoService = inject(TopoService);
  private stateLookup = inject(StateLookupService);

  constructor() { }

  ngAfterViewInit(): void {
    const host = this.USA_Ref.nativeElement as HTMLElement;
    this.width = Math.max(0, host.clientWidth - 2);
    this.height = Math.max(0, host.clientHeight - 2);

    this.topologySubscription = this.topoService.getTopology().subscribe(topo => {
      const countyFeaturesCollection = feature(
        topo as any,
        topo.objects['counties']
      ) as any;

      const stateFeaturesCollection = feature(
        topo as any,
        topo.objects['states']
      ) as any;

      const nationFeaturesCollection = feature(
        topo as any,
        topo.objects['nation']
      ) as any;

      const stateMesh = mesh(
        topo as any,
        topo.objects['states'],
        (a: any, b: any) => a !== b
      );

      const nationMesh = mesh(
        topo as any,
        topo.objects['nation']
      );

      this.createChoropleth(
        stateFeaturesCollection,
        countyFeaturesCollection,
        stateMesh,
        nationFeaturesCollection,
        nationMesh
      );
    });
  }

  ngOnDestroy(): void {
    this.topologySubscription?.unsubscribe();
  }

  private createChoropleth(
    stateFeaturesCollection: any,
    countyFeaturesCollection: any,
    stateMesh: any,
    nationFeaturesCollection: any,
    nationMesh: any
  ): void {
    this.createChoroplethContainer();
    this.createCountyLayer(countyFeaturesCollection);
    this.createStatesMesh(stateMesh);
    this.createNationLayer(nationMesh);
    this.createStateCentroidLayer(stateFeaturesCollection);
    this.createStatesTextLayer(stateFeaturesCollection);
    this.adjustGroupSizeAndPosition();

    this.choroUSAEvent.emit(true);
  }

  private createChoroplethContainer(): void {
    select(this.USA_Ref.nativeElement).selectAll('*').remove();

    this.svg = select(this.USA_Ref.nativeElement)
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('width', '100%')
      .style('height', '100%');

    this.usa = this.svg.append('g').attr('id', 'usa');

    this.countyLayer = this.usa.append('g').attr('id', 'county-layer');
    this.stateLayer = this.usa.append('g').attr('id', 'state-layer');
    this.nationLayer = this.usa.append('g').attr('id', 'nation-layer');
    this.stateTextLayer = this.usa.append('g').attr('id', 'state-name-layer');
  }

  private createCountyLayer(countyFeaturesCollection: any): void {
    this.countyLayer
      .selectAll('path')
      .data(countyFeaturesCollection.features)
      .enter()
      .append('path')
      .attr('d', this.geoPath)
      .attr('fips', (d: any) => d.id)
      .attr('name', (d: any) => d.properties?.name)
      .attr('class', 'nslx')
      .style('stroke', '#404040')
      .style('stroke-width', '.2')
      .style('fill', 'var(--choro-state-county-fill)')
      .on('click', (_event: MouseEvent, d: any) => {
        console.log('%c County selected GEOID:', 'color:#68b1ff', d.id);
      })
      .append('title')
      .text((d: any) => `${d.properties?.name ?? ''}, `)
      .attr('class', 'countyPopup');
  }

  private createStatesMesh(stateMesh: any): void {
    this.stateLayer
      .append('path')
      .attr('id', 'statemesh')
      .attr('class', 'state_path')
      .attr('d', this.geoPath(stateMesh))
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '.3');
  }

  private createNationLayer(nationMesh: any): void {
    this.nationLayer
      .append('path')
      .attr('class', 'nation_path')
      .attr('d', this.geoPath(nationMesh))
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '.5px');
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
      .attr('class', 'state-label')
      .attr('id', (d: any) => `state-label-${d.id}`)

      .attr('x', (d: any) => {
        const [x] = this.geoPath.centroid(d);
        const placement = this.stateLookup.statesDictionary[d.id];

        return x + (placement?.dx ?? 0);
      })

      .attr('y', (d: any) => {
        const [, y] = this.geoPath.centroid(d);
        const placement = this.stateLookup.statesDictionary[d.id];

        return y + (placement?.dy ?? 0);
      })

      .attr('transform', (d: any) => {
        const [x, y] = this.geoPath.centroid(d);
        const placement = this.stateLookup.statesDictionary[d.id];

        const dx = placement?.dx ?? 0;
        const dy = placement?.dy ?? 0;

        const rotate =
          (placement?.albersRotate ??
            this.getLatitudeTangentAngle(d)) * -1;

        return `rotate(${rotate}, ${x + dx}, ${y + dy})`;
      })

      .attr('text-anchor', (d: any) =>
        this.stateLookup.statesDictionary[d.id]?.anchor ?? 'middle'
      )

      .style('font-size', (d: any) => {
        const scale =
          this.stateLookup.statesDictionary[d.id]?.fontScale ?? 1;

        return `${14 * scale}px`;
      })

      .style('display', (d: any) =>
        this.stateLookup.statesDictionary[d.id]?.hidden ? 'none' : null
      )

      .text((d: any) =>
        this.stateLookup.statesDictionary[d.id]?.stateName ?? ''
      );
  }

  private createStateCentroidLayer(stateFeaturesCollection: any): void {
    const centroidLayer = this.stateLayer
      .append('g')
      .attr('id', 'gStateCentroids')
      .attr('class', 'state-centroid-layer');

    // Bounding boxes
    centroidLayer
      .selectAll('rect.state-bounds')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('rect')
      .attr('class', 'state-bounds')
      .attr('x', (d: any) => this.geoPath.bounds(d)[0][0])
      .attr('y', (d: any) => this.geoPath.bounds(d)[0][1])
      .attr('width', (d: any) => {
        const b = this.geoPath.bounds(d);
        return b[1][0] - b[0][0];
      })
      .attr('height', (d: any) => {
        const b = this.geoPath.bounds(d);
        return b[1][1] - b[0][1];
      })
      .attr('fill', 'transparent')
      .attr('stroke', 'var(--plt-pop)')
      .attr('stroke-width', 0.75)
      .attr('stroke-dasharray', '4 3')
      .style('opacity', 0.85)
      .style('pointer-events', 'all')
      .on('mouseenter', function (this: SVGRectElement) {
        select(this).style('opacity', 0.85);
      })
      .on('mouseleave', function (this: SVGRectElement) {

        const layer = select('#gStateCentroids');

        if (layer.classed('centroid-mode-hover')) {
          select(this).style('opacity', 0);
        }
      });

    // Centroid dots
    centroidLayer
      .selectAll('circle.state-centroid')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('circle')
      .attr('class', 'state-centroid')
      .attr('cx', (d: any) => this.geoPath.centroid(d)[0])
      .attr('cy', (d: any) => this.geoPath.centroid(d)[1])
      .attr('r', 3);
  }

  private adjustGroupSizeAndPosition(): void {
    const usaBBox = this.usa.node().getBBox();

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

    this.usa.attr(
      'transform',
      `translate(${translateX}, ${translateY}) scale(${scale})`
    );
  }
}
