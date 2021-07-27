import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable()
export class ComplianceService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  getClientCompliances(query) {
    return this.http
      .post(environment.server + '/api/v1/client/compliance/reports', query)
      .pipe(map((res: any) => res));
  }

  getCaregiverCompliances(query) {
    return this.http
      .post(environment.server + '/api/v1/caregiver/compliance/reports', query)
      .pipe(map((res: any) => res));
  }
}
