import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzButtonCuboid } from './jz-button-cuboid';

describe('JzButtonCuboid', () => {
  let component: JzButtonCuboid;
  let fixture: ComponentFixture<JzButtonCuboid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButtonCuboid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzButtonCuboid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
