// base-chart.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, inject } from '@angular/core';
import { BaseChartComponent } from './base-chart.component';

// ⬇️ Test-only concrete subclass
@Component({
  standalone: true,                 // use standalone to avoid NgModule boilerplate
  selector: 'spec-chart',
  template: '<svg></svg>',          // minimal template (or your base expects <g> etc.)
  // If BaseChartComponent uses its own template via inheritance, you can leave this as ''.
})
class SpecChartComponent extends BaseChartComponent {

  protected createChart(): void { /* no-op for test */ }
  protected drawYAxes(): void { /* no-op for test */ }
}

describe('BaseChartComponent (via concrete subclass)', () => {
  let fixture: ComponentFixture<SpecChartComponent>;
  let component: SpecChartComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecChartComponent],   // ✅ standalone goes in imports
      // providers: [ { provide: ChartDataService, useValue: mockDataSvc }, ... ]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecChartComponent); // ✅ instantiate the concrete subclass
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
