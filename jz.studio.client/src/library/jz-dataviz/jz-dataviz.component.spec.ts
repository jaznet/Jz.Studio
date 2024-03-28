import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzDatavizComponent } from './jz-dataviz.component';

describe('JzDatavizComponent', () => {
  let component: JzDatavizComponent;
  let fixture: ComponentFixture<JzDatavizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzDatavizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzDatavizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
