import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SandboxComponent } from './sandbox.component'; // Make sure the path is correct

describe('SandboxComponent', () => {
  let component: SandboxComponent;
  let fixture: ComponentFixture<SandboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SandboxComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
