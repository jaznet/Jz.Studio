import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverTestComponent } from './popover-test.component';

describe('PopoverTest', () => {
  let component: PopoverTestComponent;
  let fixture: ComponentFixture<PopoverTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopoverTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
