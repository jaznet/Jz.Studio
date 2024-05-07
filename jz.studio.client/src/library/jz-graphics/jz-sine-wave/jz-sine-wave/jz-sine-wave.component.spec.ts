import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzSineWaveComponent } from './jz-sine-wave.component';

describe('JzSineWaveComponent', () => {
  let component: JzSineWaveComponent;
  let fixture: ComponentFixture<JzSineWaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JzSineWaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzSineWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
