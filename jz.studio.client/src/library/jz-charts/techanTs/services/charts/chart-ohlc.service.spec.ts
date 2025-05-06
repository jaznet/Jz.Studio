import { TestBed } from '@angular/core/testing';
import { ChartOhlcService } from './chart-ohlc.service';



describe('ChartOhlcService', () => {
  let service: ChartOhlcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartOhlcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
