import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzButtonBase } from './jz-button-base';

describe('JzButtonBase', () => {
  let component: JzButtonBase;
  let fixture: ComponentFixture<JzButtonBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButtonBase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzButtonBase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
