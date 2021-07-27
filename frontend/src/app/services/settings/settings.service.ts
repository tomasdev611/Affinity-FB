import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Response} from '../../models/response';

@Injectable()
export class SettingsService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   *
   * @param id
   */

  getGroups(userName) {
    return this.http.get(environment.server + '/api/v1/securitygroup/' + userName.name + '/').pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  getClasses(userName) {
    return this.http
      .get(environment.server + '/api/v1/securitygroup/class/' + userName.name + '/')
      .pipe(
        map(
          (res: any) => res //.json()
        )
      );
  }

  getLocation(userName) {
    return this.http
      .get(environment.server + '/api/v1/securitygroup/location/' + userName.name + '/')
      .pipe(
        map(
          (res: any) => res //.json()
        )
      );
  }

  updateGroup(rowInfo) {
    return this.http.post(environment.server + '/api/v1/securitygroup/', eval(rowInfo)).pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  updateClass(rowInfo) {
    return this.http.post(environment.server + '/api/v1/securitygroup/class/', eval(rowInfo)).pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  updateLocation(rowInfo) {
    return this.http
      .post(environment.server + '/api/v1/securitygroup/location/', eval(rowInfo))
      .pipe(
        map(
          (res: any) => res //.json()
        )
      );
  }

  getCompanySettings(token) {
    return this.http.get(environment.server + '/api/v1/business/settings/' + token + '/').pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  updateCompanySettings(params) {
    return this.http.post(environment.server + '/api/v1/business/settings/', eval(params)).pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  getIpRecords() {
    return this.http.get(environment.server + '/api/v1/iptable').pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  createIpTable(params) {
    return this.http.post(environment.server + '/api/v1/iptable', params).pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  updateSingleIpRecord(id, data) {
    return this.http.put(`${environment.server}/api/v1/iptable/${id}`, data).pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }

  deleteIpRecord(id) {
    return this.http.delete(`${environment.server}/api/v1/iptable/${id}`, {}).pipe(
      map(
        (res: any) => res //.json()
      )
    );
  }
}
