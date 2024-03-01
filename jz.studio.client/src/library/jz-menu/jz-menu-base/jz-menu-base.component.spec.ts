import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBaseComponent } from './jz-menu-base.component';

describe('MenuBaseComponent', () => {
  let component: MenuBaseComponent;
  let fixture: ComponentFixture<MenuBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
