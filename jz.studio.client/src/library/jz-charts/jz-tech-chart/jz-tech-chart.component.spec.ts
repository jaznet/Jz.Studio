import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTechChartComponent } from './jz-tech-chart.component';

describe('JzTechChartComponent', () => {
  let component: JzTechChartComponent;
  let fixture: ComponentFixture<JzTechChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JzTechChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzTechChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
