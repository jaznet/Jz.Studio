import { EventEmitter, Injectable, Output } from '@angular/core';
import * as d3 from 'd3';
import { Feature, Point, GeoJsonProperties, FeatureCollection } from 'geojson';
import { BehaviorSubject } from 'rxjs';
import * as topojson from 'topojson';
import { GeometryCollection } from 'geojson';

import { Topology, Objects } from 'topojson-specification';
import { MyTopoJSON } from '../models/MyTopoJSON';


@Injectable({  
  providedIn: 'root'
})
export class TopoService {
  //albersUsaLoadedEvent = new EventEmitter<any>();
  private albersUsaLoadedEvent = new BehaviorSubject<boolean>(false);
  dataReady$ = this.albersUsaLoadedEvent.asObservable();

  stateMesh!: d3.GeoPermissibleObjects;
  countyFeaturesCollection!: FeatureCollection<Point, GeoJsonProperties>;
  stateFeaturesCollection!: FeatureCollection<Point, GeoJsonProperties>;
  nationFeaturesCollection!: FeatureCollection<Point, GeoJsonProperties>;
  nationMesh!: d3.GeoPermissibleObjects;

  constructor() { }

  setDataReady(status: boolean) {
    this.albersUsaLoadedEvent.next(status);
  }

  getTopology() {
    d3.json<MyTopoJSON>("/assets/maps/counties-albers-10m.json")
      .then((topo: any) => {
        const topology: Topology<Objects> = topo;
        this.countyFeaturesCollection = topojson.feature(topology, topology.objects['counties']) as unknown as FeatureCollection<Point, GeoJsonProperties>;
        this.stateFeaturesCollection = topojson.feature(topology, topology.objects['states']) as unknown as FeatureCollection<Point, GeoJsonProperties>;
        this.stateMesh = topojson.mesh(topology, topology.objects['states'], (a:any, b) => a !== b);
        this.nationFeaturesCollection = topojson.feature(topology, topology.objects['nation']) as unknown as FeatureCollection<Point, GeoJsonProperties>;
        this.nationMesh = topojson.mesh(topology, topology.objects['nation']);
        console.log('topo', topology);
      
        this.setDataReady(true);

      })
      .catch((error:string): void => {
        console.error("An error occurred while loading the JSON data:", error);
      })
      
  }

  getStateFeature(stateFips: string) {
    return this.stateFeaturesCollection.features.find(feature => String(feature.id) === stateFips);
  }
}
