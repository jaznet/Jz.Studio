
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopoverBaseComponent } from './pop-over-base.component';

describe('PopoverBaseComponent', () => {
  let component: PopoverBaseComponent;
  let fixture: ComponentFixture<PopoverBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopoverBaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopoverBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
