import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoroUsaComponent } from './choro-usa.component';

describe('ChoroUsaComponent', () => {
  let component: ChoroUsaComponent;
  let fixture: ComponentFixture<ChoroUsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChoroUsaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoroUsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
