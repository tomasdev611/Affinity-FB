
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from "@angular/common/http";


import { environment } from '../../../environments/environment';

@Injectable()
export class SuperAdminDivisionService {

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
  getAllSupserAdminDivisions() {
    return this.http.get(environment.server + '/api/v1/superdivision/').pipe(map(
      (res: any) => res
    ));
  }

  addNewDivision(data) {
    console.log(data);

    return this.http.post(environment.server + '/api/v1/superdivision/add/', data).pipe(map(
      (res: any) => res
    ));
  }
  deleteDivision(data) {
    console.log(data);

    return this.http.get(environment.server + '/api/v1/superdivision/delete/' + data.division_id).pipe(map(
      (res: any) => res
    ));
  }




}
