import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTechnicalAnalysisComponent } from './jz-technical-analysis.component';

describe('JzTechnicalAnalysisComponent', () => {
  let component: JzTechnicalAnalysisComponent;
  let fixture: ComponentFixture<JzTechnicalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzTechnicalAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzTechnicalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
