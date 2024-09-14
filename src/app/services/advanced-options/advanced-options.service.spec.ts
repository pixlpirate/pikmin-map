import { TestBed } from '@angular/core/testing';

import { AdvancedOptionsService } from './advanced-options.service';

describe('AdvancedOptionsService', () => {
  let service: AdvancedOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvancedOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
