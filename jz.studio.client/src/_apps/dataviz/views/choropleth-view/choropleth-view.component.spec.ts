import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoroplethViewComponent } from './choropleth-view.component';

describe('ChoroplethViewComponent', () => {
  let component: ChoroplethViewComponent;
  let fixture: ComponentFixture<ChoroplethViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChoroplethViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoroplethViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
