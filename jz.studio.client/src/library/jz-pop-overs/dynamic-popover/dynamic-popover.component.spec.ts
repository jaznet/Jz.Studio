import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPopoverComponent } from './dynamic-popover.component';

describe('DynamicPopoverComponent', () => {
  let component: DynamicPopoverComponent;
  let fixture: ComponentFixture<DynamicPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicPopoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
