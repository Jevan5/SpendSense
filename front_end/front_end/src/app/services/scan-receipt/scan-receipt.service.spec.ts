import { TestBed } from '@angular/core/testing';

import { ScanReceiptService } from './scan-receipt.service';

describe('ScanReceiptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScanReceiptService = TestBed.get(ScanReceiptService);
    expect(service).toBeTruthy();
  });
});
