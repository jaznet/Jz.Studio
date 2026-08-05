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
import { CountyDataService } from 'jz-choro-dash';
import {
  CountyPaintingStrategy,
  COUNTY_PAINTING_STRATEGY
} from '../../interface/county-painting-strategy.token';
import { geoCentroid, geoAlbersUsa } from 'd3-geo';
import { GeoShapeSet } from 'jz-choro-dash';
import { CountySelection } from '../../../../../../libraries/apps/jz-choro-dash/src/lib/models/county-selection.model';

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
  @Output() countySelected = new EventEmitter<CountySelection>();

  private topologySubscription?: Subscription;

  width = 0;
  height = 0;

  private svg: any;
  private usaLayer: any;
  private stateLayer: any;
  public countyLayer: any;
  private nationLayer: any;
  private stateTextLayer: any;
  public centroidMode: 'all' | 'hover' | 'none' = 'hover';

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
    // this.createStatesLayer(stateFeaturesCollection,stateMesh);
    this.createStateFeatureLayer(stateFeaturesCollection);
    this.createStatesMesh(stateMesh);
    this.createNationLayer(nationMesh);
    this.createStatesTextLayer(stateFeaturesCollection);
    this.createStateCentroidLayer(stateFeaturesCollection);
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

    this.usaLayer = this.svg.append('g').attr('id', 'usa');

    this.countyLayer = this.usaLayer.append('g').attr('id', 'county-layer');
    this.stateLayer = this.usaLayer.append('g').attr('id', 'state-layer');
    this.nationLayer = this.usaLayer.append('g').attr('id', 'nation-layer');
    this.stateTextLayer = this.usaLayer.append('g').attr('id', 'state-name-layer');
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
      .attr('class', 'choro-county-path')
      .attr('vector-effect', 'non-scaling-stroke')
      .on('click', (_event: MouseEvent, d: any) => {

        const countyId =
          String(d.id).padStart(5, '0');

        const stateId =
          countyId.substring(0, 2);

        console.log(
          '%cCounty CLICKED',
          'color:yellow',
          countyId,
          stateId,
          d
        );

        this.countySelected.emit({
          countyId,
          stateId,
          countyFeature: d
        });
      })
      .append('title')
      .text((d: any) => d.properties?.name ?? '');

    console.log(
      'County count',
      countyFeaturesCollection.features.length
    );
  }

  private createStatesLayer(
    stateFeaturesCollection: any,
    stateMesh: any
  ): void {
    this.stateLayer = this.usaLayer
      .append('g')
      .attr('id', 'state-layer');

    this.stateLayer
      .selectAll('path.state')
      .data(stateFeaturesCollection.features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', this.geoPath as any)
      .attr('fill', 'transparent')
      .attr('stroke', 'none');

    this.stateLayer
      .append('path')
      .datum(stateMesh)
      .attr('class', 'state-mesh')
      .attr('d', this.geoPath as any)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.3);
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

      //.style('font-family', 'museo')
      //.style('font-size', (d: any) => {
      //  const scale =
      //    this.stateLookup.statesDictionary[d.id]?.fontScale ?? 1;

      //  return `${13 * scale}px`;
      //})

      //.style('fill', 'skyblue')
      //.style('stroke', 'none')
      //.style('font-weight', '600')

      //.style('display', (d: any) =>
      //  this.stateLookup.statesDictionary[d.id]?.hidden ? 'none' : null
      //)

      .text((d: any) =>
        this.stateLookup.statesDictionary[d.id]?.stateName ?? ''
      );
  }

  private createStateCentroidLayer(stateFeaturesCollection: any): void {
    const centroidLayer = this.usaLayer
      .append('g')
      .attr('id', 'gStateCentroids')
      .attr('class', 'state-centroid-layer centroid-mode-all');
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
      .attr('pointer-events', 'none')
      .style('display', this.centroidMode === 'all' ? 'block' : 'none');

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
    console.log('%cadjustGroupSizeAndPosition', 'color:#b08d57');
  }
}
