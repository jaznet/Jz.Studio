import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalAnalysisViewComponent } from './technical-analysis-view.component';

describe('TechnicalAnalysisViewComponent', () => {
  let component: TechnicalAnalysisViewComponent;
  let fixture: ComponentFixture<TechnicalAnalysisViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicalAnalysisViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechnicalAnalysisViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
