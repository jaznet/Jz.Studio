import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatavizComponent } from './visualization.component';

describe('DatavizComponent', () => {
  let component: DatavizComponent;
  let fixture: ComponentFixture<DatavizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatavizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatavizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
