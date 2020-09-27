import { TestBed } from '@angular/core/testing';

import { ProgramServService } from './program-serv.service';

describe('ProgramServService', () => {
  let service: ProgramServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
