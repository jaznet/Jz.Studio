import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { StockPriceHistory, TechnicalAnalysisComponent } from 'jz-technical-analysis';
import { Subject, takeUntil } from 'rxjs';

import { MarketPriceService } from '../../services/market-price.service';

@Component({
  selector: 'technical-analysis-host',
  standalone: true,
  imports: [TechnicalAnalysisComponent],
  template: `
    @if (loading) {
      <div class="status">Loading {{ ticker }} market data...</div>
    } @else if (errorMessage) {
      <div class="status status--error">{{ errorMessage }}</div>
    } @else {
      <techanTs
        [chartTitle]="chartTitle"
        [stockPriceHistoryData]="stockPriceHistoryData" />
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }

    .status {
      display: grid;
      width: 100%;
      height: 100%;
      place-items: center;
      color: var(--plt-txt-2);
      background: var(--plt-clr-2);
    }

    .status--error {
      color: var(--plt-pop);
    }
  `]
})
export class TechnicalAnalysisHostComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'fit-to-parent';

  readonly ticker = 'NVDA';
  readonly chartTitle = `${this.ticker} Technical Analysis`;

  stockPriceHistoryData: StockPriceHistory[] = [];
  loading = true;
  errorMessage = '';

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly marketPriceService: MarketPriceService) { }

  ngOnInit(): void {
    this.marketPriceService.getStockPrices(this.ticker)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: data => {
          this.stockPriceHistoryData = data;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.message || `Unable to load ${this.ticker} market data.`;
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
