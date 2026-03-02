import { TestBed } from '@angular/core/testing';

import { JzButtonState } from './jz-button-state';

describe('JzButtonState', () => {
  let service: JzButtonState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzButtonState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
