import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoroStateComponent } from './choro-state.component';

describe('ChoroStateComponent', () => {
  let component: ChoroStateComponent;
  let fixture: ComponentFixture<ChoroStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoroStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoroStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
