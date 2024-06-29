import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopOverLoadingComponent } from './pop-over-loading.component';

describe('PopoverLoadingComponent', () => {
  let component: PopOverLoadingComponent;
  let fixture: ComponentFixture<PopOverLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopOverLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopOverLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
