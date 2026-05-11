import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzBubbleChart } from './jz-bubble-chart';

describe('JzBubbleChart', () => {
  let component: JzBubbleChart;
  let fixture: ComponentFixture<JzBubbleChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzBubbleChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzBubbleChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
