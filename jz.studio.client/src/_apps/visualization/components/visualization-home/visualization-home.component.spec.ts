import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizationHomeComponent } from './visualization-home.component';

describe('DatavizHomeComponent', () => {
  let component: VisualizationHomeComponent;
  let fixture: ComponentFixture<VisualizationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizationHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
