import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable()
export class MasterformService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  // to call api for get all payors
  runCaregiverPhoneJob() {
    return this.http
      .post(environment.server + '/api/v1/masterform/sync_caregiver_phone', {})
      .pipe(map((res: any) => res));
  }
}
