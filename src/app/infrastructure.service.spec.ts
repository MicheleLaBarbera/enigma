import { TestBed, inject } from '@angular/core/testing';

import { InfrastructureService } from './infrastructure.service';

describe('InfrastructureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfrastructureService]
    });
  });

  it('should be created', inject([InfrastructureService], (service: InfrastructureService) => {
    expect(service).toBeTruthy();
  }));
});
