import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Response} from '../../models/response';

@Injectable()
export class UserService {
  /**
   *
   * @param http
   */
  constructor(public http: HttpClient) {}

  /**
   *
   * @param id
   */
  get(idOrToken) {
    const body = {company_name: 'test'};
    return this.http
      .post('https://jsonplaceholder.typicode.com/posts/1', body)
      .pipe(map((res: any) => res));
  }

  /**
   *
   * @param id
   */
  getAccessControl(idOrToken) {
    return this.http
      .get(environment.server + '/api/v1/securityusers/acl/' + idOrToken + '/')
      .pipe(map((res: any) => res));
  }

  fetchSecurityUsers() {
    return this.http.get(environment.server + '/api/v1/securityusers').pipe(map((res: any) => res));
  }

  getUserInfo(userName) {
    return this.http
      .get(`${environment.server}/api/v1/securityusers/${userName}`)
      .pipe(map((res: any) => res));
  }

  postAddUserData(postData) {
    return this.http
      .post(`${environment.server}/api/v1/securityusers`, postData)
      .pipe(map((res: any) => res));
  }

  resetUserPassword(userName, userPassword) {
    let postData = {
      userPassword
    };
    return this.http
      .post(`${environment.server}/api/v1/securityusers/${userName}/reset-password`, postData)
      .pipe(map((res: any) => res));
  }

  updateUserData(userName, updateData) {
    return this.http
      .put(`${environment.server}/api/v1/securityusers/${userName}`, updateData)
      .pipe(map((res: any) => res));
  }

  deleteUserData(userName) {
    return this.http
      .delete(`${environment.server}/api/v1/securityusers/${userName}`)
      .pipe(map((res: any) => res));
  }
}
