import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SankeyViewComponent } from './sankey-view.component';

describe('SankeyViewComponent', () => {
  let component: SankeyViewComponent;
  let fixture: ComponentFixture<SankeyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SankeyViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SankeyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
