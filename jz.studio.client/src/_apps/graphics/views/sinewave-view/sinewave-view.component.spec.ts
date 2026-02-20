import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinewaveViewComponent } from './sinewave-view.component';

describe('SinewaveViewComponent', () => {
  let component: SinewaveViewComponent;
  let fixture: ComponentFixture<SinewaveViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinewaveViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SinewaveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
