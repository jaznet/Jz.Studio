import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacdChartComp } from './macd-chart.component';

describe('MacdChartComponent', () => {
  let component: MacdChartComp;
  let fixture: ComponentFixture<MacdChartComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MacdChartComp]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MacdChartComp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
