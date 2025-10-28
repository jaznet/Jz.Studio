import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzButton3dComponent } from './jz-button3d.component';

describe('JzButton3dComponent', () => {
  let component: JzButton3dComponent;
  let fixture: ComponentFixture<JzButton3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButton3dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzButton3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
