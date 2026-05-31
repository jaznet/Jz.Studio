import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverTest } from './popover-test.component';

describe('PopoverTest', () => {
  let component: PopoverTest;
  let fixture: ComponentFixture<PopoverTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopoverTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
