import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemBaseComponent } from './jz-menu-item-base.component';

describe('MenuItemBaseComponent', () => {
  let component: MenuItemBaseComponent;
  let fixture: ComponentFixture<MenuItemBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuItemBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuItemBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
