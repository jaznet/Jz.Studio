import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JzSpirographComponent } from './jz-spirograph.component';

describe('JzSpirographComponent', () => {
  let component: JzSpirographComponent;
  let fixture: ComponentFixture<JzSpirographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JzSpirographComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JzSpirographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
