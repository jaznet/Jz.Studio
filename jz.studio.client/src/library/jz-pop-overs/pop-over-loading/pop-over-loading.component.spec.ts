import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverLoadingComponent } from './popover-loading.component';

describe('PopoverLoadingComponent', () => {
  let component: PopoverLoadingComponent;
  let fixture: ComponentFixture<PopoverLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopoverLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
