import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzUi } from './jz-ui';

describe('JzUi', () => {
  let component: JzUi;
  let fixture: ComponentFixture<JzUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
