import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzNavItemComponent } from './jz-nav-item.component';

describe('JzNavItem', () => {
  let component: JzNavItemComponent;
  let fixture: ComponentFixture<JzNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzNavItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
