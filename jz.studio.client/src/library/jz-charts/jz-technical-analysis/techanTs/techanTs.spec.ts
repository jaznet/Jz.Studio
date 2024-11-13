import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechanTsComponent } from './techanTs.component';

describe('JzTechnicalAnalysisComponent', () => {
  let component: TechanTsComponent;
  let fixture: ComponentFixture<TechanTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechanTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechanTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
