import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {

  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ShellComponent
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the shell theme service', () => {
    expect(component.themeState$).toBeTruthy();
  });

});
