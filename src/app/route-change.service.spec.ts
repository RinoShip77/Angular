import { TestBed } from '@angular/core/testing';

import { RouteChangeService } from './route-change.service';

describe('RouteChangeService', () => {
  let service: RouteChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
