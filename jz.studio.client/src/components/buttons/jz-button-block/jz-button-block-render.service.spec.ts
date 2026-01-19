import { TestBed } from '@angular/core/testing';

import { JzButtonBlockRenderService } from './jz-button-block-render.service';

describe('JzButtonBlockRenderService', () => {
  let service: JzButtonBlockRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JzButtonBlockRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
