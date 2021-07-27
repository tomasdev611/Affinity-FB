
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from "@angular/common/http";

import { environment } from '../../../environments/environment';

@Injectable()
export class CasemanagerService {

  //for fetch the localstroge data(auth token and current db version)

  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {
  }

  /**
 *
 */
  getAll(body) {
    return this.http.get(environment.server + '/api/v1/casemanager', body).pipe(map(
      (res: any) => res
    ));
  }

}
