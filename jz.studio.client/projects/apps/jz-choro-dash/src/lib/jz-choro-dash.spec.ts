import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzChoroDash } from './jz-choro-dash';

describe('JzChoroDash', () => {
  let component: JzChoroDash;
  let fixture: ComponentFixture<JzChoroDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzChoroDash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzChoroDash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
