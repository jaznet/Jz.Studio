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
  UsaRenderHandle
} from '../../models/usa-renderer.model';
import { COUNTY_SELECTION_DISPATCHER } from '../../services/county-selection-dispatcher.token';
import { ResponsiveRenderScheduler } from '../../services/responsive-render-scheduler.service';
import { UsaLayoutCoordinatorService } from '../../services/usa-layout-coordinator.service';

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

  private renderHandle?: UsaRenderHandle;

  constructor(
    @Inject(COUNTY_SELECTION_DISPATCHER)
    private countySelectionDispatcher: CountySelectionDispatcher,
    private usaLayoutCoordinator: UsaLayoutCoordinatorService
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
    if (!this.viewReady) {
      return;
    }

    const result = this.usaLayoutCoordinator.layout({
      host: this.USA_Ref.nativeElement,
      shapeSet: this.shapeSet,
      currentHandle: this.renderHandle,
      forceRender: this.needsRender,
      selectedCountyId: this.selectedCountyId,
      showCentroids: this.showCentroids,
      centroidMode: this.centroidMode,
      onCountySelected: countyFeature =>
        this.countySelectionDispatcher.dispatch(
          this.countySelected,
          countyFeature
        )
    });

    if (!result) {
      return;
    }

    this.renderHandle = result.handle;
    this.needsRender = false;

    if (result.rendered) {
      this.choroUSAEvent.emit(true);
    }
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
