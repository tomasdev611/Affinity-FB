import { TestBed, inject } from '@angular/core/testing';
import { SuperAdminDivisionService } from './superAdminDivision.service';


describe('SuperAdminDivisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperAdminDivisionService]
    });
  });

  it('should be created', inject([SuperAdminDivisionService], (service: SuperAdminDivisionService) => {
    expect(service).toBeTruthy();
  }));
});
