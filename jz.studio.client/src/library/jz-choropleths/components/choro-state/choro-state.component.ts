
import { Component, ElementRef, EventEmitter, HostBinding, Inject, Output, ViewChild } from '@angular/core';
import { first, Subscription } from 'rxjs';
import * as d3 from 'd3';
import * as d3Select from 'd3-selection';
import { StateLookupService } from '../../services/state-lookup.service';
import { TopoService } from '../../services/topo.service';
import { CountyDataService } from '../../services/county-data.service';
import { CountyPaintingStrategy } from '../../interface/county-painting-strategy';
import { PAINTING_STRATEGY_TOKEN } from '../../../jz-choro-dash/jz-choro-dash.module';

@Component({
  selector: 'choro-state',
  templateUrl: './choro-state.component.html',
  styleUrls: ['./choro-state.component.css']
})
export class ChoroStateComponent {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('US_state', { static: true }) state_Ref!: ElementRef;
  @Output() choroStateEvent = new EventEmitter<any>();
  
  svg!: any;
  outerGroup: any;
  state: any;
  counties: any;
  //state_counties_layer: any;
  countyPaths: any;
  private stateFips: string = '13';
  width: any;
  height: any;

  constructor(
    @Inject(PAINTING_STRATEGY_TOKEN) private paintingStrategy: CountyPaintingStrategy,
    private countyDataService: CountyDataService,
    private topoService: TopoService,
    private stateLookup: StateLookupService
  ) { }

  ngOnInit(): void {
    this.topoService.dataReady$.pipe(
      first((value: boolean) => value === true)  // Wait until the value becomes true
    ).subscribe(() => {
      this.createStateChoropleth();
    });

    this.countyDataService.getCountyDataObservable().subscribe(data => {
      if (data) {
      //  this.paintCounties(data);
      }
    });
  }

  ngOnDestroy(): void {
    // handled by first
  }

  ngAfterViewInit(): void {
    this.width = this.state_Ref?.nativeElement.clientWidth-2;
    this.height = this.state_Ref?.nativeElement.clientHeight - 2;
  }

  createStateChoropleth() {
    this.createStateChoroplethContainer();
    this.createCountyLayer();
    this.adjustStateGroupSizeAndPosition();
    this.applyRotation();
    this.choroStateEvent.emit(true);
  }

  createStateChoroplethContainer() {
    this.svg = d3Select.select(this.state_Ref!.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      ;

    // Outer group for rotation
    this.outerGroup = this.svg.append('g').attr('id', 'outer-group');

    // State group inside the outer group
    this.state = this.outerGroup.append('g').attr('id', 'state');
  }

  createCountyLayer() {
    const stateFipsCode = '13'; // Replace with dynamic state code if necessary
    const geoPath = d3.geoPath(); // Ensure you have the correct projection set up

    this.counties = this.state.append('g').attr('id', 'counties');

    this.counties.selectAll("path")
      .data(this.topoService.countyFeaturesCollection.features.filter(d =>
        String(d.id).slice(0, 2) === stateFipsCode
      ))
      .enter()
      .append("path")
      .attr("d", geoPath)
      .style('stroke', 'black')
      .style('stroke-width', '.2')
      .style("fill", 'pink')
    // ... rest of the styling and event handlers
  }

  adjustStateGroupSizeAndPosition() {
    const stateBBox = this.state.node().getBBox();

    // Calculate scaling factors for width and height
    const scaleX = this.width / stateBBox.width;
    const scaleY = this.height / stateBBox.height;

    // Choose the smaller scaling factor to preserve aspect ratio
    const scale = Math.min(scaleX, scaleY);

    // Calculate translation to center the content horizontally
    const translateX = (this.width - stateBBox.width * scale) / 2 - stateBBox.x * scale;
    const translateY = (this.height - stateBBox.height * scale) / 2 - stateBBox.y * scale;

    const rotationAngle = this.stateLookup.statesDictionary[this.stateFips]?.albersRotate || 0;

    const centerX = (stateBBox.x + stateBBox.width / 2) * scale + translateX;
    const centerY = (stateBBox.y + stateBBox.height / 2) * scale + translateY;

    this.state.attr("transform",
      `translate(${translateX}, ${translateY}) ` +
      `scale(${scale}) ` );

  }

  applyRotation() {
    const rotationAngle = this.stateLookup.statesDictionary[this.stateFips]?.albersRotate || 0;

    // Apply rotation to the outer group
    this.outerGroup.attr("transform", `rotate(${rotationAngle}, ${this.width / 2}, ${this.height / 2})`);
  }

  //paintCounties(data: any) {
  //  // Assuming data is an array of objects, each with a 'fips' property and other properties used by getColor
  //  this.counties.selectAll("path")
  //    .style("fill", (d: any) => this.paintingStrategy.getColor(d)); // Apply color based on strategy
  //}
}
