import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzButtonComponent } from './jz-button.component';

describe('JzButtonComponent', () => {
  let component: JzButtonComponent;
  let fixture: ComponentFixture<JzButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
