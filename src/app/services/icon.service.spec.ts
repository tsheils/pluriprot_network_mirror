import { TestBed } from '@angular/core/testing';

import { IconServiceService } from './icon.service';

describe('IconServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IconServiceService = TestBed.get(IconServiceService);
    expect(service).toBeTruthy();
  });
});
