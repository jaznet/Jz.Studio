import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteMenuComponent } from './palette-menu.component';

describe('PaletteMenuComponent', () => {
  let component: PaletteMenuComponent;
  let fixture: ComponentFixture<PaletteMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaletteMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
