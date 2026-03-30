import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartScaffoldComponent } from './chart-scaffold.component';

//import { ChartScaffold } from './chart-scaffold';

describe('ChartScaffold', () => {
  let component: ChartScaffoldComponent;
  let fixture: ComponentFixture<ChartScaffoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartScaffoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartScaffoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
