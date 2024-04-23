import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsMenuComponent } from './graphics-menu.component';

describe('GraphicsMenuComponent', () => {
  let component: GraphicsMenuComponent;
  let fixture: ComponentFixture<GraphicsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphicsMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphicsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
