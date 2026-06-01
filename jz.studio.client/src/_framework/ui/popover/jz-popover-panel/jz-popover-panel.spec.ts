import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopoverPanelComponent } from './jz-popover-panel.component';

describe('JzPopoverPanel', () => {
  let component: JzPopoverPanelComponent;
  let fixture: ComponentFixture<JzPopoverPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzPopoverPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopoverPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
