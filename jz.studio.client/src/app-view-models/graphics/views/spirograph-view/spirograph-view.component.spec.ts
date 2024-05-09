import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpirographViewComponent } from './spirograph-view.component';

describe('SpirographViewComponent', () => {
  let component: SpirographViewComponent;
  let fixture: ComponentFixture<SpirographViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpirographViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpirographViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
