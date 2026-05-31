import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopoverPanel } from './jz-popover-panel.component';

describe('JzPopoverPanel', () => {
  let component: JzPopoverPanel;
  let fixture: ComponentFixture<JzPopoverPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzPopoverPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopoverPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
