import { TestBed, inject } from '@angular/core/testing';

import { UserPortalService } from './user-portal.service';

describe('UserPortalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPortalService]
    });
  });

  it('should be created', inject([UserPortalService], (service: UserPortalService) => {
    expect(service).toBeTruthy();
  }));
});
