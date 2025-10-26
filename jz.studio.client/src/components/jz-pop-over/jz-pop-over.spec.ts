import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzPopOverComponent } from './jz-pop-over';

describe('JzPopOver', () => {
  let component: JzPopOverComponent;
  let fixture: ComponentFixture<JzPopOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzPopOverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzPopOverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
   
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
