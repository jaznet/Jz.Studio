import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzMenuTabComponent } from './jz-menu-tab.component';

describe('JzMenuTabComponent', () => {
  let component: JzMenuTabComponent;
  let fixture: ComponentFixture<JzMenuTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JzMenuTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzMenuTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
