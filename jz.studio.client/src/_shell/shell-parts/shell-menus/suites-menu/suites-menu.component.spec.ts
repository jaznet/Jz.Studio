import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitesMenuComponent } from './suites-menu.component';

describe('SuitesMenuComponent', () => {
  let component: SuitesMenuComponent;
  let fixture: ComponentFixture<SuitesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitesMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuitesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
