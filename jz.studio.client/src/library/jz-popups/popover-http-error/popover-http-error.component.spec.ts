import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorPopoverComponent } from './http-error-popover.component';

describe('HttpErrorPopoverComponent', () => {
  let component: HttpErrorPopoverComponent;
  let fixture: ComponentFixture<HttpErrorPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttpErrorPopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HttpErrorPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
