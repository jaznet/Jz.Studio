import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopoverErrorComponent } from './jz-popover-error.component';

describe('JzPopoverError', () => {
  let component: JzPopoverErrorComponent;
  let fixture: ComponentFixture<JzPopoverErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzPopoverErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopoverErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
