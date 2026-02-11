import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellHeaderComponent } from './shell-header.component';

describe('AppHeaderComponent', () => {
  let component: ShellHeaderComponent;
  let fixture: ComponentFixture<ShellHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShellHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShellHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
