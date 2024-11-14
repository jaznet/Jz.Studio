import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechanTsViewComponent } from './techan-ts-view.component';

describe('TechanTsViewComponent', () => {
  let component: TechanTsViewComponent;
  let fixture: ComponentFixture<TechanTsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechanTsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechanTsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
