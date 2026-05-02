import { TestBed } from '@angular/core/testing';

import { SetupsService } from './setups-service';

describe('SetupsService', () => {
  let service: SetupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
