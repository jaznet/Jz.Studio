import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzRadioButtonComponent } from './jz-radio-button.component';

describe('JzRadioButtonComponent', () => {
  let component: JzRadioButtonComponent;
  let fixture: ComponentFixture<JzRadioButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzRadioButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
