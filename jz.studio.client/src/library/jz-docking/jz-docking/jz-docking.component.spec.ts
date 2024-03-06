import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzDockingComponent } from './jz-docking.component';

describe('JzDockingComponent', () => {
  let component: JzDockingComponent;
  let fixture: ComponentFixture<JzDockingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzDockingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzDockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
