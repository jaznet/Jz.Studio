import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  StockPriceHistory,
  TechnicalAnalysisComponent,
  TechnicalAnalysisDataWindow
} from 'jz-technical-analysis';
import {
  JzPopoverErrorComponent,
  JzPopoverErrorService,
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
  @ViewChild('interactionHelpToggle') private interactionHelpToggle?: ElementRef<HTMLButtonElement>;
  @ViewChild('interactionHelpPanel') private interactionHelpPanel?: ElementRef<HTMLElement>;

  ticker = 'NVDA';
  symbolInput = this.ticker;
  readonly rangePresets = [
    { label: '6M', months: 6 },
    { label: '1Y', months: 12 },
    { label: '3Y', months: 36 },
    { label: '5Y', months: 60 }
  ] as const;
  selectedRangeMonths: number | undefined = 12;
  visibleStartInput: string;
  visibleEndInput: string;
  dataWindow?: TechnicalAnalysisDataWindow;
  validationMessage = '';
  interactionHelpVisible = false;

  stockPriceHistoryData: StockPriceHistory[] = [];
  loading = true;

  private readonly destroyed$ = new Subject<void>();
  private appliedVisibleStartInput: string;
  private appliedVisibleEndInput: string;
  private loadingPopoverRef?: JzPopoverRef;
  private interactionHelpFocusTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly marketPriceService: MarketPriceService,
    private readonly popoverErrorService: JzPopoverErrorService,
    private readonly popoverService: JzPopoverService
  ) {
    const visibleEnd = new Date();
    visibleEnd.setHours(0, 0, 0, 0);
    const visibleStart = this.addMonths(visibleEnd, -12);

    this.visibleStartInput = this.toDateInput(visibleStart);
    this.visibleEndInput = this.toDateInput(visibleEnd);
    this.appliedVisibleStartInput = this.visibleStartInput;
    this.appliedVisibleEndInput = this.visibleEndInput;
    this.dataWindow = { visibleStart, visibleEnd };
  }

  get applyPending(): boolean {
    return this.symbolInput.trim().toUpperCase() !== this.ticker
      || this.visibleStartInput !== this.appliedVisibleStartInput
      || this.visibleEndInput !== this.appliedVisibleEndInput;
  }

  ngOnInit(): void {
    this.loadMarketData();
  }

  toggleInteractionHelp(event: MouseEvent): void {
    event.stopPropagation();
    this.setInteractionHelpVisible(!this.interactionHelpVisible);
  }

  toggleInteractionHelpFromKeyboard(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.setInteractionHelpVisible(!this.interactionHelpVisible);
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.interactionHelpVisible) return;

    const target = event.target;
    if (!(target instanceof Element) || !target.closest('.interaction-help')) {
      this.setInteractionHelpVisible(false);
    }
  }

  @HostListener('document:keydown.escape')
  closeInteractionHelp(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.setInteractionHelpVisible(false);
  }

  private setInteractionHelpVisible(visible: boolean): void {
    if (this.interactionHelpVisible === visible) return;

    this.interactionHelpVisible = visible;
    if (this.interactionHelpFocusTimer) {
      clearTimeout(this.interactionHelpFocusTimer);
    }

    this.interactionHelpFocusTimer = setTimeout(() => {
      this.interactionHelpFocusTimer = undefined;
      if (visible) {
        this.interactionHelpPanel?.nativeElement.focus();
      } else {
        this.interactionHelpToggle?.nativeElement.focus();
      }
    });
  }

  selectRangePreset(months: number): void {
    const visibleEnd = this.parseDate(this.visibleEndInput);
    if (!visibleEnd) {
      this.selectedRangeMonths = undefined;
      this.validationMessage = 'Enter a valid end date before selecting a range.';
      return;
    }

    this.selectedRangeMonths = months;
    const visibleStart = this.addMonths(visibleEnd, -months);
    this.visibleStartInput = this.toDateInput(visibleStart);
    this.appliedVisibleStartInput = this.visibleStartInput;
    this.appliedVisibleEndInput = this.visibleEndInput;
    this.dataWindow = { visibleStart, visibleEnd };
    this.validationMessage = '';
  }

  onVisibleStartInput(value: string): void {
    this.visibleStartInput = value;
    this.selectedRangeMonths = undefined;
  }

  onVisibleEndInput(value: string): void {
    this.visibleEndInput = value;
    this.selectedRangeMonths = undefined;
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
    this.appliedVisibleStartInput = this.visibleStartInput;
    this.appliedVisibleEndInput = this.visibleEndInput;

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
      ...this.popoverErrorService.build(error),
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
    if (this.interactionHelpFocusTimer) {
      clearTimeout(this.interactionHelpFocusTimer);
    }
    this.closeLoadingPopover();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
