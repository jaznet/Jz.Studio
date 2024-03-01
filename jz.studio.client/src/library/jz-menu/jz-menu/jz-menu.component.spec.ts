import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzMenuComponent } from './jz-menu.component';

describe('JzMenuComponent', () => {
  let component: JzMenuComponent;
  let fixture: ComponentFixture<JzMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JzMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
