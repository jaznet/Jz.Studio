import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomTreeComponent } from './random-tree.component';

describe('RandomTreeComponent', () => {
  let component: RandomTreeComponent;
  let fixture: ComponentFixture<RandomTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
