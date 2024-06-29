import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverHttpErrorComponent } from '../../jz-pop-overs/pop-over-http-error/pop-over-http-error.component';

describe('PopoverHttpErrorComponent', () => {
  let component: PopoverHttpErrorComponent;
  let fixture: ComponentFixture<PopoverHttpErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopoverHttpErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverHttpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
