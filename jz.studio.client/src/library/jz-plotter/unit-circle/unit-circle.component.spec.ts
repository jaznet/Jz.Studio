import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCircleComponent } from './unit-circle.component';

describe('UnitCircleComponent', () => {
  let component: UnitCircleComponent;
  let fixture: ComponentFixture<UnitCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitCircleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
