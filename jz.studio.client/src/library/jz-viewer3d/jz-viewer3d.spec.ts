import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JzViewer3d } from './jz-viewer3d';



describe('JzViewer3d', () => {
  let component: JzViewer3d;
  let fixture: ComponentFixture<JzViewer3d>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JzViewer3d]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JzViewer3d);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
