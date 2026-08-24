import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnDestroy, OnInit, ElementRef } from '@angular/core';
import {
  StockPriceHistory,
  TechnicalAnalysisComponent,
  TechnicalAnalysisDataWindow
} from 'jz-technical-analysis';
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
  templateUrl: './technical-analysis-host.component.html',
  styleUrl: './technical-analysis-host.component.scss'
})
export class TechnicalAnalysisHostComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent';

  ticker = 'NVDA';
  symbolInput = this.ticker;
  visibleStartInput: string;
  visibleEndInput: string;
  dataWindow?: TechnicalAnalysisDataWindow;
  validationMessage = '';

  stockPriceHistoryData: StockPriceHistory[] = [];
  loading = true;

  private readonly destroyed$ = new Subject<void>();
  private loadingPopoverRef?: JzPopoverRef;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly marketPriceService: MarketPriceService,
    private readonly popoverService: JzPopoverService
  ) {
    const visibleEnd = new Date();
    visibleEnd.setHours(0, 0, 0, 0);
    const visibleStart = this.addMonths(visibleEnd, -12);

    this.visibleStartInput = this.toDateInput(visibleStart);
    this.visibleEndInput = this.toDateInput(visibleEnd);
    this.dataWindow = { visibleStart, visibleEnd };
  }

  ngOnInit(): void {
    this.loadMarketData();
  }

  applySelection(): void {
    const symbol = this.symbolInput.trim().toUpperCase();
    if (!/^[A-Z0-9.-]+$/.test(symbol)) {
      this.validationMessage = 'Enter a valid stock symbol.';
      return;
    }

    const visibleStart = this.parseDate(this.visibleStartInput);
    const visibleEnd = this.parseDate(this.visibleEndInput);

    if (
      (this.visibleStartInput && !visibleStart) ||
      (this.visibleEndInput && !visibleEnd)
    ) {
      this.validationMessage = 'Enter valid start and end dates.';
      return;
    }

    if (
      this.visibleStartInput &&
      this.visibleEndInput &&
      visibleStart &&
      visibleEnd &&
      visibleStart > visibleEnd
    ) {
      this.validationMessage = 'The start date must be before the end date.';
      return;
    }

    this.validationMessage = '';
    this.symbolInput = symbol;
    this.dataWindow = {};
    if (visibleStart) this.dataWindow.visibleStart = visibleStart;
    if (visibleEnd) this.dataWindow.visibleEnd = visibleEnd;

    if (symbol !== this.ticker) {
      this.ticker = symbol;
      this.loadMarketData();
    }
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
          this.closeLoadingPopover();
          this.showError(error);
        }
      });
  }

  private parseDate(value: string): Date | undefined {
    if (!value) return undefined;

    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    const day = result.getDate();

    result.setDate(1);
    result.setMonth(result.getMonth() + months);

    const lastDay = new Date(
      result.getFullYear(),
      result.getMonth() + 1,
      0
    ).getDate();
    result.setDate(Math.min(day, lastDay));

    return result;
  }

  private toDateInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
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
