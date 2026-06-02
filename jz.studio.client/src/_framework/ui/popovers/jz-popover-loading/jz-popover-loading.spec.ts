import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopoverLoadingComponent } from './jz-popover-loading.component';

describe('JzPopoverLoading', () => {
  let component: JzPopoverLoadingComponent;
  let fixture: ComponentFixture<JzPopoverLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzPopoverLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopoverLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
