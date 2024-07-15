import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatavizDefaultViewComponent } from './dataviz-default-view.component';

describe('DatavizDefaultViewComponent', () => {
  let component: DatavizDefaultViewComponent;
  let fixture: ComponentFixture<DatavizDefaultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatavizDefaultViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatavizDefaultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
