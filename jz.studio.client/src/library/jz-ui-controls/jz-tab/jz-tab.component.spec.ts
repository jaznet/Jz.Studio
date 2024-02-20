import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzTabComponent } from './jz-tab.component';

describe('JzTabComponent', () => {
  let component: JzTabComponent;
  let fixture: ComponentFixture<JzTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JzTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
