import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzChoroDashLoaderComponent } from './jz-choro-dash-loader.component';

describe('JzChoroDashLoaderComponent', () => {
  let component: JzChoroDashLoaderComponent;
  let fixture: ComponentFixture<JzChoroDashLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzChoroDashLoaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzChoroDashLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
