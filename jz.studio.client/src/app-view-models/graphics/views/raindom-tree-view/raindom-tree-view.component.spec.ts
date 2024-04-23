import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaindomTreeViewComponent } from './raindom-tree-view.component';

describe('RaindomTreeViewComponent', () => {
  let component: RaindomTreeViewComponent;
  let fixture: ComponentFixture<RaindomTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaindomTreeViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaindomTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
