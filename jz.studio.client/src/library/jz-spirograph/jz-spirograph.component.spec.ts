import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpirographComponent } from './spirograph.component';

describe('SpirographComponent', () => {
  let component: SpirographComponent;
  let fixture: ComponentFixture<SpirographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpirographComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpirographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
