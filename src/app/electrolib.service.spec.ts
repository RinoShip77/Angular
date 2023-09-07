import { TestBed } from '@angular/core/testing';

import { ElectrolibService } from './electrolib.service';

describe('ElectrolibService', () => {
  let service: ElectrolibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectrolibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
