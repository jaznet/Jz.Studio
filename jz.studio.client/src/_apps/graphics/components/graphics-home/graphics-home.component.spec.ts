import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsHomeComponent } from './graphics-home.component';

describe('GraphicsHomeComponent', () => {
  let component: GraphicsHomeComponent;
  let fixture: ComponentFixture<GraphicsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicsHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphicsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
