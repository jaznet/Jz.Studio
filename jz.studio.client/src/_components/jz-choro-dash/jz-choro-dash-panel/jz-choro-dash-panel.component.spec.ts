import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzChoroDashPanelComponent } from './jz-choro-dash-panel.component';

describe('JzChoroDashPanelComponent', () => {
  let component: JzChoroDashPanelComponent;
  let fixture: ComponentFixture<JzChoroDashPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzChoroDashPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzChoroDashPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
