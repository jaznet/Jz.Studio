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
import {
  UsaRenderHandle,
  UsaRenderer
} from '../../models/usa-renderer.model';
import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { RenderViewportMeasurerService } from '../../services/render-viewport-measurer.service';
import { ResponsiveRenderScheduler } from '../../services/responsive-render-scheduler.service';
import { UsaRenderRequestFactoryService } from '../../services/usa-render-request-factory.service';
import { USA_RENDERER } from '../../services/usa-renderer.token';

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
    private viewportMeasurer: RenderViewportMeasurerService,
    private usaRenderRequestFactory: UsaRenderRequestFactoryService,
    @Inject(USA_RENDERER)
    private usaRenderer: UsaRenderer
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
    const viewport = this.viewportMeasurer.measure(
      this.USA_Ref.nativeElement
    );

    if (!viewport) {
      return;
    }

    this.width = viewport.width;
    this.height = viewport.height;

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

    const renderOptions = this.usaRenderRequestFactory.create({
      host: this.USA_Ref.nativeElement,
      width: this.width,
      height: this.height,
      shapeSet: this.shapeSet,
      selectedCountyId: this.selectedCountyId,
      showCentroids: this.showCentroids,
      centroidMode: this.centroidMode,
      onCountySelected: countyFeature =>
        this.countySelectionDispatcher.dispatch(
          this.countySelected,
          countyFeature
        )
    });

    if (!renderOptions) {
      return;
    }

    this.renderHandle = this.usaRenderer.render(renderOptions);
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
