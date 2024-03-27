import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockManagerComponent } from './dock-manager.component';

describe('DockManagerComponent', () => {
  let component: DockManagerComponent;
  let fixture: ComponentFixture<DockManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DockManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DockManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
