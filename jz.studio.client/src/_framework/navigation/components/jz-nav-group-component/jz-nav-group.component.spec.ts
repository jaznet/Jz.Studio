import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzNavGroupComponent } from './jz-nav-group.component';

describe('JzNavGroupComponent', () => {
  let component: JzNavGroupComponent;
  let fixture: ComponentFixture<JzNavGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzNavGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzNavGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
