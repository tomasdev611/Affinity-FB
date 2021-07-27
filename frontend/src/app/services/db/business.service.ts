
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from "@angular/common/http";


import { environment } from '../../../environments/environment';

@Injectable()
export class BusinessService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) { }

  /**
   *
   * @param id
   * ,{ responseType: ResponseContentType.Blob }
   */
  get(idOrToken) {
    return this.http.get(environment.server + '/api/v1/business/' + idOrToken+'/').pipe(map(
      (res: any) => res
    ));
  }

  post(param) {
    return this.http.post(environment.server + '/api/v1/business/', param).pipe(map(
      (res: any) => res
    ));
  }

}
