import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JzButtonCuboidComponent } from './jz-button-cuboid.component';



describe('JzButtonCuboid', () => {
  let component: JzButtonCuboidComponent;
  let fixture: ComponentFixture<JzButtonCuboidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzButtonCuboidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzButtonCuboidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
