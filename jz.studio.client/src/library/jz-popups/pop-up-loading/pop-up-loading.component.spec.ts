import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpLoadingComponent } from './pop-up-loading.component';

describe('PopUpLoadingComponent', () => {
  let component: PopUpLoadingComponent;
  let fixture: ComponentFixture<PopUpLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
