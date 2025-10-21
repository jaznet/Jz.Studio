import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopOver } from './jz-pop-over';

describe('JzPopOver', () => {
  let component: JzPopOver;
  let fixture: ComponentFixture<JzPopOver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzPopOver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopOver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
