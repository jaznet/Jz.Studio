import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzSyncfusionChartComponent } from './jz-syncfusion-chart.component';

describe('JzSyncfusionChartComponent', () => {
  let component: JzSyncfusionChartComponent;
  let fixture: ComponentFixture<JzSyncfusionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzSyncfusionChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzSyncfusionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
