import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockingViewComponent } from './docking-view.component';

describe('DockingViewComponent', () => {
  let component: DockingViewComponent;
  let fixture: ComponentFixture<DockingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DockingViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DockingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
