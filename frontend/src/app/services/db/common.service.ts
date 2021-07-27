import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';

@Injectable()
export class CommonService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   *
   */
  getClientCommonInfo() {
    return this.http.get(environment.server + '/api/v1/client/common').pipe(map((res: any) => res));
  }

  getCommonInfo() {
    return this.http
      .get(environment.server + '/api/v1/masterform/all')
      .pipe(map((res: any) => res));
  }

  createCommonData(data) {
    return this.http
      .post(`${environment.server}/api/v1/masterform/data`, data)
      .pipe(map((res: any) => res));
  }

  updateCommonData(data) {
    return this.http
      .put(`${environment.server}/api/v1/masterform/data`, data)
      .pipe(map((res: any) => res));
  }

  deleteCommonData(data) {
    return this.http
      .post(`${environment.server}/api/v1/masterform/data/delete`, data)
      .pipe(map((res: any) => res));
  }
}
