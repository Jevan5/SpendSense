import { TestBed } from '@angular/core/testing';

import { ManualentryService } from './manualentry.service';

describe('ManualentryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManualentryService = TestBed.get(ManualentryService);
    expect(service).toBeTruthy();
  });
});
