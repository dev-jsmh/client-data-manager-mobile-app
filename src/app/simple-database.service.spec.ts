import { TestBed } from '@angular/core/testing';

import { SimpleDatabaseService } from './simple-database.service';

describe('SimpleDatabaseService', () => {
  let service: SimpleDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
