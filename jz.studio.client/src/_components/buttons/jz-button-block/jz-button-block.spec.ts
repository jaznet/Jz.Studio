import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzButtonBlockComponent } from './jz-button-block';

describe('JzButtonBlock', () => {
  let component: JzButtonBlockComponent;
  let fixture: ComponentFixture<JzButtonBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButtonBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzButtonBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
