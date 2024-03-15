import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzChoroDashComponent } from './jz-choro-dash.component';

describe('JzChoroDashComponent', () => {
  let component: JzChoroDashComponent;
  let fixture: ComponentFixture<JzChoroDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzChoroDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzChoroDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
