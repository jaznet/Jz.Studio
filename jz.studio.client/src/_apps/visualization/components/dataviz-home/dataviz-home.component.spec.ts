import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatavizHomeComponent } from './dataviz-home.component';

describe('DatavizHomeComponent', () => {
  let component: DatavizHomeComponent;
  let fixture: ComponentFixture<DatavizHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatavizHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatavizHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
