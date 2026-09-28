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

import { CountySelection } from '../../models/county-selection.model';
import { CountySelectionDispatcher } from '../../models/county-selection-dispatcher.model';
import { GeoShapeSet } from '../../models/geo-shape-set.model';
import { StateCentroidMode } from '../../models/state-centroid-mode.model';
import { UsaRenderHandle } from '../../models/usa-renderer.model';
import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { ResponsiveRenderScheduler } from '../../services/responsive-render-scheduler.service';
import { UsaRendererFacadeService } from '../../services/usa-renderer-facade.service';

@Component({
  selector: 'choro-usa',
  imports: [],
  templateUrl: './choro-usa.component.html',
  styleUrls: ['./choro-usa.component.scss']
})

export class ChoroUsaComponent implements AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent grid-rows';
  @ViewChild('USA', { static: true })
  USA_Ref!: ElementRef<HTMLElement>;
  @Input() shapeSet?: GeoShapeSet;
  @Input() showCentroids = false;
  @Input() centroidMode: StateCentroidMode = 'hover';
  @Input() selectedCountyId: string | null = null;
  @Output() choroUSAEvent = new EventEmitter<boolean>();
  @Output() countySelected = new EventEmitter<CountySelection>();

  private viewReady = false;
  private needsRender = true;
  private readonly layoutScheduler = new ResponsiveRenderScheduler(
    () => this.layoutChoropleth()
  );

  width = 0;
  height = 0;

  private renderHandle?: UsaRenderHandle;

  constructor(
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    private usaRenderer: UsaRendererFacadeService
  ) { }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.layoutScheduler.observe(this.USA_Ref.nativeElement);
    this.scheduleLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shapeSet']) {
      this.needsRender = true;
      this.scheduleLayout();
    }

    if (changes['showCentroids'] || changes['centroidMode']) {
      this.applyCentroidPresentation();
    }

    if (changes['selectedCountyId']) {
      this.applyCountySelection();
    }
  }

  ngOnDestroy(): void {
    this.layoutScheduler.destroy();
  }

  private scheduleLayout(): void {
    if (!this.viewReady) {
      return;
    }

    this.layoutScheduler.schedule();
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

    if (!this.renderHandle || this.needsRender) {
      this.tryCreateChoropleth();
      return;
    }

    this.renderHandle.resize(this.width, this.height);
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

    this.renderHandle = this.usaRenderer.render({
      host: this.USA_Ref.nativeElement,
      width: this.width,
      height: this.height,
      stateFeaturesCollection: shapeSet.features,
      countyFeaturesCollection: shapeSet.detailFeatures,
      stateMesh: shapeSet.mesh,
      nationMesh: shapeSet.outline,
      selectedCountyId: this.selectedCountyId,
      showCentroids: this.showCentroids,
      centroidMode: this.centroidMode,
      onCountySelected: countyFeature =>
        this.countySelectionDispatcher.dispatch(
          this.countySelected,
          countyFeature
        )
    });
    this.needsRender = false;

    this.choroUSAEvent.emit(true);
  }

  private applyCountySelection(): void {
    this.renderHandle?.applyCountySelection(this.selectedCountyId);
  }

  private applyCentroidPresentation(): void {
    this.renderHandle?.applyCentroidPresentation(
      this.showCentroids,
      this.centroidMode
    );
  }
}
