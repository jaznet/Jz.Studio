import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopoverBaseComponent } from './popover-base.component';

describe('JzPopoverBaseComponent', () => {
  let component: JzPopoverBaseComponent;
  let fixture: ComponentFixture<JzPopoverBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JzPopoverBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopoverBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
