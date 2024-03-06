import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxMenuComponent } from './sandbox-menu.component';

describe('SandboxMenuComponent', () => {
  let component: SandboxMenuComponent;
  let fixture: ComponentFixture<SandboxMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SandboxMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SandboxMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
