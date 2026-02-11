import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellFooterComponent } from './shell-footer.component';

describe('AppFooterComponent', () => {
  let component: ShellFooterComponent;
  let fixture: ComponentFixture<ShellFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShellFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
