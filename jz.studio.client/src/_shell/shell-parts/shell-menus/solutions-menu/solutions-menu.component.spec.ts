import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsMenuComponent } from './solutions-menu.component';

describe('MainMenuComponent', () => {
  let component: SolutionsMenuComponent;
  let fixture: ComponentFixture<SolutionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolutionsMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
