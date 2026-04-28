import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzButton } from './jz-button';

describe('JzButton', () => {
  let component: JzButton;
  let fixture: ComponentFixture<JzButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
