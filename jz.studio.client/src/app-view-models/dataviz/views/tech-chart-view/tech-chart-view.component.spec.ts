import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechChartViewComponent } from './tech-chart-view.component';

describe('TechChartViewComponent', () => {
  let component: TechChartViewComponent;
  let fixture: ComponentFixture<TechChartViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechChartViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
