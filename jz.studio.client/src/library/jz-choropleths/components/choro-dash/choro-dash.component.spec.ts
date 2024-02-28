import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoroDashComponent } from './choro-dash.component';

describe('ChoroDashComponent', () => {
  let component: ChoroDashComponent;
  let fixture: ComponentFixture<ChoroDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChoroDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChoroDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
