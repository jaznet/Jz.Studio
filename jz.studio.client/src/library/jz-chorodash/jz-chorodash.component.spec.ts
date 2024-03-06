import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzChorodashComponent } from './jz-chorodash.component';

describe('JzChorodashComponent', () => {
  let component: JzChorodashComponent;
  let fixture: ComponentFixture<JzChorodashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzChorodashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzChorodashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
