import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzSpinnerComponent } from './jz-spinner.component';

describe('JzSpinnerComponent', () => {
  let component: JzSpinnerComponent;
  let fixture: ComponentFixture<JzSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzSpinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
