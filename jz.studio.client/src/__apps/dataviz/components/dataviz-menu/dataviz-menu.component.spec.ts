import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatavizMenuComponent } from './dataviz-menu.component';

describe('DatavizMenuComponent', () => {
  let component: DatavizMenuComponent;
  let fixture: ComponentFixture<DatavizMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatavizMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatavizMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
