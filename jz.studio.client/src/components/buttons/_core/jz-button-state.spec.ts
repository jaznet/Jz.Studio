import { TestBed } from '@angular/core/testing';

import { JzButtonState } from '../../../_framework/ui/buttons/_core/jz-button-state.model';

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
