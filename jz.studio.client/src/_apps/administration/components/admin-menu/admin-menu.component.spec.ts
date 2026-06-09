import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationMenuComponent } from './admin-menu.component';

describe('AdministrationMenuComponent', () => {
  let component: AdministrationMenuComponent;
  let fixture: ComponentFixture<AdministrationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrationMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
