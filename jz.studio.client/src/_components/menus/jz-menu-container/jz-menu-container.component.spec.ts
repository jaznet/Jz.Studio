import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzMenuContainerComponent } from './jz-menu-container.component';

describe('MenuContainerComponent', () => {
  let component: JzMenuContainerComponent;
  let fixture: ComponentFixture<JzMenuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzMenuContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JzMenuContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
