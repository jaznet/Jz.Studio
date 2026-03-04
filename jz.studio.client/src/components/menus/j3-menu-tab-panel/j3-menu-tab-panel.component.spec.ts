import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTabPanelComponent } from './j3-menu-tab-panel.component';

describe('MenuTabPanelComponent', () => {
  let component: MenuTabPanelComponent;
  let fixture: ComponentFixture<MenuTabPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuTabPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTabPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
