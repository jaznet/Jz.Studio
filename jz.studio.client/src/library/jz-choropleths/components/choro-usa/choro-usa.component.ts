
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TopoService } from '../../services/topo.service';
import { select } from 'd3-selection';
import { geoPath} from 'd3-geo';
import { first, Subscription } from 'rxjs';
import { ChoroUtilsService } from '../../services/choro-utils.service';
import { StateLookupService } from '../../services/state-lookup.service';
import { CountyDataService } from '../../services/county-data.service';
import { CountyPaintingStrategy } from '../../interface/county-painting-strategy';
import * as topojson from 'topojson';
import { PAINTING_STRATEGY_TOKEN } from '../../../jz-choro-dash/jz-choro-dash.module';

@Component({
  selector: 'choro-usa',
  templateUrl: './choro-usa.component.html',
  styleUrls: ['./choro-usa.component.css']
})
export class ChoroUsaComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('USA', { static: true }) USA_Ref!: ElementRef;
  @Output() choroUSAEvent = new EventEmitter<any>();

  private topoEventEmitterSubscription!: Subscription;

  width: any;
  height: any;

  private svg: any; 
  private usa: any;
  private stateLayer: any;
  /*public countyLayer!: { attr: (arg0: string, arg1: string) => { (): any; new(): any; selectAll: { (arg0: string): { (): any; new(): any; data: { (arg0: Feature<Point, GeoJsonProperties>[]): { (): any; new(): any; enter: { (): { (): any; new(): any; append: { (arg0: string): { (): any; new(): any; style: { (arg0: string, arg1: string): { (): any; new(): any; style: { (arg0: string, arg1: string): { (): any; new(): any; style: { (arg0: string, arg1: (d: any) => string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => any): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => any): { (): any; new(): any; attr: { (arg0: string, arg1: (d: any) => string): { (): any; new(): any; on: { (arg0: string, arg1: (m: any, d: any) => void): { (): any; new(): any; on: { (arg0: string, arg1: (d: any, fips: any) => void): { (): any; new(): any; on: { (arg0: string, arg1: (d: any) => void): { (): any; new(): any; on: { (arg0: string, arg1: (d: any) => void): { (): any; new(): any; append: { (arg0: string): { (): any; new(): any; text: { (arg0: (d: any) => string): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; style: { (arg0: string, arg1: string): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; new(): any; }; }; };*/
  public countyLayer: any;
  private nationLayer: any;
  private stateTextLayer: any;
  private geoPath = geoPath();

  constructor(
    @Inject(PAINTING_STRATEGY_TOKEN) private paintingStrategy: CountyPaintingStrategy,
    private countyDataService: CountyDataService,
    private topoService: TopoService,
    private choroUtils: ChoroUtilsService,
    private stateLookup: StateLookupService) {
    console.log(this.paintingStrategy);
  }

  ngOnInit() {
    this.topoService.getTopology();

    this.topoService.dataReady$.pipe(
      first((value: boolean) => value === true)  // Wait until the value becomes true
    ).subscribe(() => {
      this.createChoropleth();
    });

    this.countyDataService.getCountyDataObservable().subscribe(data => {
      if (data) {
       // this.paintCounties(data);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.topoEventEmitterSubscription) {
      this.topoEventEmitterSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.width = this.USA_Ref?.nativeElement.clientWidth - 2;
    this.height = this.USA_Ref?.nativeElement.clientHeight - 2;
  }

  createChoropleth() {
    console.log('createChoropleth');
    this.createChoroplethContainer();
    this.createStatesMesh();
    this.createCountyLayer();
    this.createNationLayer();
    this.createStatesTextLayer();
    this.adjustGroupSizeAndPosition();

    this.choroUSAEvent.emit(true);
    //   this.paintCountyData();
  }

  createChoroplethContainer() {
  
    this.svg = select(this.USA_Ref!.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      ;
    this.usa = this.svg.append('g').attr('id', 'usa');
    this.usa.append('g').attr('id', 'county-layer');
    this.usa.append('g').attr('id', 'state-layer');
    this.usa.append('g').attr('id', 'nation-layer');
    this.usa.append('g').attr('id', 'state-name-layer');

    this.stateLayer = this.svg.select("#state-layer");
    this.countyLayer = this.svg.select("#county-layer");
    this.nationLayer = this. svg.select("#nation-layer");
    this.stateTextLayer = this.svg.select("#state-name-layer");
  }

  createStatesMesh() {
    console.groupCollapsed('%c  Create States', 'color:#06729D');
    //  console.log('data', this.topoService.stateMesh.coordinates);
    var that = this;

    const stateLayer: any = select("#state-layer")
      .attr("id", "state-layer")
      .attr("class", "state_style");

    stateLayer
      .append("path")
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '.3')
      .attr("id", 'statemesh')
      .attr('bbox', function (d: any) {
        return 'jaz';
      })
      .attr("class", "state_path")
      .attr("d", that.geoPath(that.topoService.stateMesh))
      .on('mouseenter', (d: any, event: MouseEvent) => {
        // change stroke
        console.log(d);
      })
      ;

    console.groupEnd();
  }

  createCountyLayer() {
    var that = this;

    this.countyLayer
      .attr("id", "county-layer")
      .selectAll("path")
      .data(that.topoService.countyFeaturesCollection?.features)
      .enter()
      .append("path")
      .style('stroke', '#404040')
      .style('stroke-width', '.2')
      .style("fill", function (d: any) {
        return 'pink';
      })
      .attr("fips", function (d: any) { return d.id; })
      .attr("class", "nslx")
      .attr("name", function (d: any) { return d.properties.name; })
      .attr("d", function (d: any) {
        if (d.id === "12087" || d.id === "02016" || d.id === "02050") {
          const coord = that.geoPath(topojson.mesh(d, d.geometry.coordinates, (a: any, b: any) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)));
        }
        return "M" + d.geometry.coordinates;
      })

      .on("click", function (m: any, d: any) {
        console.log('%c  County selected GEOID: ', 'color:#68b1ff', d.id);
        //  that.choroDashService.countySelected(d.id);
      })

      .on('mouseover', function (d: any, fips: any) {
        //let t = this.select('path');
        //this.style("fill", "yellow");
        // console.log(this);
      })
      .on('mouseenter', function (d: any) {
        //let t = this.select('path');
        //this.style("fill", "yellow");
        //console.log(d.properties.NAME);
        //   that.highlightCounty(d, this, that);
      })
      .on('mouseleave', function (d: any) {
        //let t = this.select('path');
        //this.style("fill", "yellow");
        //   that.unhighlightCounty(d, this, that);
      })

      .append("title")
      .text(function (d: any) {
        return d.properties.name + ', ';// + that.choroService.countyInformationDictionary[d.properties.GEOID].State;
      })
      .attr('class', 'countyPopup')
      .style('stroke', '#cc44cc');
    console.groupEnd();
  }

  createNationLayer() {
    console.groupCollapsed('%c  Create Nation', 'color:#06729D');
    // console.log('data', this.topoService.nationMesh.coordinates);
    var that = this;

    const t = topojson;
    select("#nation-layer")
      .attr("id", "nation-layer")
      .attr("class", "nation_style")
      .selectAll("path")
      .data(this.topoService.nationFeaturesCollection.features)
      .enter()
      .append("path")
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', '.5px')
      .attr("d", that.geoPath(that.topoService.nationMesh))
      .attr("class", "nation_path");

    let node: SVGGElement = this.stateLayer.node();

    console.groupEnd();
  }

  createStatesTextLayer() {
    const that = this;
    const stateNameLayer: any = select("#state-name-layer")
      .attr("id", "state-name-layer")
      .attr("class", "small");

    stateNameLayer
      .selectAll("text")
      .data(this.topoService.stateFeaturesCollection!.features)
      .enter()
      .append("text")
      .attr("id", function (d: any) {
        return d.id;
      })
      .attr('bbox', function (d: any) {
        const bbox = that.choroUtils.GetPathBounds("M" + d.geometry.coordinates);
        const xctr = bbox[0] + ((bbox[2] - bbox[0]) / 2);
        return bbox;
      })
      .attr('transform', function (d: any) {
        const bbox = that.choroUtils.GetPathBounds("M" + d.geometry.coordinates);
        const x = (bbox[0] + ((bbox[2] - bbox[0]) / 2)) + that.stateLookup.statesDictionary[d.id].dx;
        const y = (bbox[1] + ((bbox[3] - bbox[1]) / 2)) + that.stateLookup.statesDictionary[d.id].dy;
        const angle = that.stateLookup.statesDictionary[d.id].albersRotate;
        const rotate: string = 'rotate(' + (angle * -1) + ',' + x + ',' + y + ')';
        return rotate;
      })
      .attr('x', function (d: any) {
        const bbox = that.choroUtils.GetPathBounds("M" + d.geometry.coordinates);
        const xctr = (bbox[0] + ((bbox[2] - bbox[0]) / 2)) + that.stateLookup.statesDictionary[d.id].dx;;
        return xctr;
      })
      .attr('y', function (d: any) {
        const bbox = that.choroUtils.GetPathBounds("M" + d.geometry.coordinates);
        const yctr = (bbox[1] + ((bbox[3] - bbox[1]) / 2)) + that.stateLookup.statesDictionary[d.id].dy;
        return yctr;
      })
      .text(function (d: any) {
        return that.stateLookup.statesDictionary[d.id].stateName;
      })
      .attr('class', 'shadow')
      .style('text-anchor', 'middle')
      .style('fill', 'black')
      .style('stroke', 'black')
      .style('font-size', '15px')
      .style('stroke-width', '.5px');
  }

  adjustGroupSizeAndPosition() {
    const usaBBox = this.usa.node().getBBox();

    // Calculate scaling factors for width and height
    const scaleX = this.width / usaBBox.width;
    const scaleY = this.height / usaBBox.height;

    // Choose the smaller scaling factor to preserve aspect ratio
    const scale = Math.min(scaleX, scaleY);

    // Calculate translation to center the content horizontally
    const translateX = (this.width - usaBBox.width * scale) / 2 - usaBBox.x * scale;
    const translateY = (this.height - usaBBox.height * scale) / 2 - usaBBox.y * scale;

    this.usa.attr("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
  }

  //paintCounties(data: any) {
  //  // Assuming data is an array of objects, each with a 'fips' property and other properties used by getColor
  //  this.countyLayer.selectAll("path")
  //    .style("fill", (d: any) => this.paintingStrategy.getColor(d)); // Apply color based on strategy
  //}

}
