import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonCuboidComponent } from './button-cuboid.component';

describe('JzButtonCuboid', () => {
  let component: ButtonCuboidComponent;
  let fixture: ComponentFixture<ButtonCuboidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonCuboidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonCuboidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
