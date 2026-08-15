import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { StockPriceHistory, TechnicalAnalysisComponent } from 'jz-technical-analysis';
import {
  buildJzPopoverErrorData,
  JzPopoverErrorComponent,
  JzPopoverLoadingComponent,
  JzPopoverRef,
  JzPopoverService
} from 'ui-interaction';
import { Subject, takeUntil } from 'rxjs';

import { MarketPriceService } from '../../services/market-price.service';

@Component({
  selector: 'technical-analysis-host',
  standalone: true,
  imports: [TechnicalAnalysisComponent],
  templateUrl: './technical-analysis-host.component.html'
})
export class TechnicalAnalysisHostComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent';

  readonly ticker = 'NVDA';
  readonly chartTitle = `${this.ticker} Technical Analysis`;

  stockPriceHistoryData: StockPriceHistory[] = [];
  loading = true;

  private readonly destroyed$ = new Subject<void>();
  private loadingPopoverRef?: JzPopoverRef;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly marketPriceService: MarketPriceService,
    private readonly popoverService: JzPopoverService
  ) { }

  ngOnInit(): void {
    this.loadMarketData();
  }

  private loadMarketData(): void {
    this.loading = true;
    this.openLoadingPopover();

    this.marketPriceService.getStockPrices(this.ticker)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: data => {
          this.stockPriceHistoryData = data;
          this.loading = false;
          this.closeLoadingPopover();
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.loadingPopoverRef = undefined;
          this.showError(error);
        }
      });
  }

  private showError(error: HttpErrorResponse): void {
    const errorData = {
      ...buildJzPopoverErrorData(error),
      allowRetry: true
    };

    const popoverRef = this.popoverService.openComponent(
      this.elementRef,
      JzPopoverErrorComponent,
      {
        positionMode: 'container-center',
        data: errorData
      }
    );

    popoverRef.afterClosed$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(result => {
        if (result === 'retry') {
          this.loadMarketData();
        }
      });
  }

  private openLoadingPopover(): void {
    this.closeLoadingPopover();

    this.loadingPopoverRef = this.popoverService.openComponent(
      this.elementRef,
      JzPopoverLoadingComponent,
      {
        positionMode: 'container-center',
        hasBackdrop: true,
        closeOnBackdropClick: false,
        closeOnEscape: false
      }
    );
  }

  private closeLoadingPopover(): void {
    const loadingPopoverRef = this.loadingPopoverRef;
    this.loadingPopoverRef = undefined;
    loadingPopoverRef?.close();
  }

  ngOnDestroy(): void {
    this.closeLoadingPopover();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
