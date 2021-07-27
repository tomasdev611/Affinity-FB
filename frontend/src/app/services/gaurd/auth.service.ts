import {Injectable} from '@angular/core';
import {cloneDeep} from 'lodash';
import {map} from 'rxjs/operators';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import {Location} from '@angular/common';

const preserveKeys = ['care_custom_array', 'client_columns', 'caregiver_columns', 'custom_array'];

const mainLinks = {
  dashboard: {
    link: '',
    title: 'Dashboard',
    canClose: false,
    type: 'dashboard',
    subLinks: []
  },
  client: {
    link: '/client/list',
    title: 'Client - List',
    canClose: true,
    type: 'client',
    subLinks: []
  },
  report: {
    link: '/reports',
    title: 'Reports',
    canClose: true,
    type: 'report',
    subLinks: []
  },
  caregiver: {
    link: '/caregiver/list',
    title: 'Caregiver - List',
    canClose: true,
    type: 'caregiver',
    subLinks: []
  },
  admin: {
    link: '/admin/master-list',
    title: 'Admin',
    canClose: true,
    type: 'admin',
    subLinks: []
  }
};

const defaultLeftLinks: any = [mainLinks.dashboard];

@Injectable()
export class AuthService {
  //for fetch the localstroge data(auth token and current db version)

  /**
   *
   * @param http
   * @param router
   */

  user: any;
  acl_list: any[];

  //array which keeps the leftLink list
  leftLinks = cloneDeep(defaultLeftLinks);

  constructor(private http: HttpClient, private router: Router, private location: Location) {}

  /**
   *
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('auth_token')) {
      return true;
    }
    console.log('signin out...');
    // not logged in so redirect to login page with the return url
    this.router.navigate(['authentication/signin']);
    return false;
  }

  checkAccess(access_group_id) {
    const acl_list = JSON.parse(localStorage.getItem('acl_list'));
    for (var i = 0; i < acl_list.length; i++) {
      var name = acl_list[i].GroupId;
      if (name == access_group_id) {
        return {
          read: acl_list[i].bit_read,
          update: acl_list[i].bit_update,
          delete: acl_list[i].bit_delete
        };
      }
    }
    return null;
  }

  checkAdminAccess() {
    const acl_list = JSON.parse(localStorage.getItem('acl_list'));
    if (acl_list) {
      for (var i = 0; i < acl_list.length; i++) {
        var name = acl_list[i].GroupId;
        if (name == 'Administrator') {
          if (acl_list[i].bit_read && acl_list[i].bit_update && acl_list[i].bit_delete) {
            return {
              read: true,
              update: true,
              delete: true
            };
          }
        }
      }
    }
    return null;
  }

  checkOverallAccess(access_group_id) {
    let access = this.checkAccess(access_group_id);
    if (access) {
      return access;
    }
    return {read: false, update: false, delete: false};
  }

  /**
   *
   */
  loginNew(body) {
    return this.http.post(environment.server + '/api/v1/auth/login', body).pipe(
      map((res: any) => {
        let data = res;
        if (data.success) {
          this.user = data.user;
          localStorage.setItem('username', data.user.userName);
          localStorage.setItem('usertype', data.user.UserType);
          this.acl_list = data.acl_list;
          localStorage.setItem('acl_list', JSON.stringify(data.acl_list));
          localStorage.setItem('inactivityTimeout', data.setting.inactivityTimeout);
          localStorage.setItem('auth_token', data.token);
        }
        return data;
      })
    );
  }

  /**
   *
   */
  getCurrentUserInfo() {
    return this.http.post(environment.server + '/api/v1/auth/me', {}).pipe(
      map((res: any) => {
        let data = res;
        if (data.success) {
          this.user = data.user;
          localStorage.setItem('username', data.user.userName);
          localStorage.setItem('usertype', data.user.UserType);
          this.acl_list = data.acl_list;
          localStorage.setItem('acl_list', JSON.stringify(data.acl_list));
          localStorage.setItem('inactivityTimeout', data.setting.inactivityTimeout);
          // localStorage.setItem('auth_token', data.token);
        } else {
          this.logout();
          // this.user = null;
        }
        return data;
      })
    );
  }

  get isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }

  /**
   *
   */
  loginSuperAdmin(body) {
    //const body = {'id':229,'username':'sandie','auth_token':'4848939','status':true};
    return this.http
      .post(environment.server + '/api/v1/auth/superAdmin', body)
      .map((res: any) => res);
  }

  /**
   *
   */
  loginAsSuperAdmin(body) {
    return this.http
      .post(environment.server + '/api/v1/auth/super-admin-token', body)
      .map((res: any) => res);
  }

  /**
   *
   */
  logout() {
    this.user = null;
    var keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!preserveKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    this.leftLinks = cloneDeep(defaultLeftLinks);
  }

  //captialise first letter of the string
  capitalizeFirstLetter(string) {
    if (string !== undefined) return string.charAt(0).toUpperCase() + string.slice(1);
  }

  checkAndAddLink(linkInfo) {
    let mainItem = this.leftLinks.find(l => l.type === linkInfo.type);
    if (!mainItem) {
      if (mainLinks[linkInfo.type]) {
        mainItem = cloneDeep(mainLinks[linkInfo.type]);
        this.leftLinks.push(mainItem);
      } else {
        this.leftLinks.push(linkInfo);
      }
    }

    if (mainItem && mainItem.link !== linkInfo.link) {
      mainItem.subLinks = mainItem.subLinks || [];
      const existing = mainItem.subLinks.find(l => l.link === linkInfo.link);
      if (!existing) {
        mainItem.subLinks.push(linkInfo);
      } else {
        Object.assign(existing, linkInfo);
      }
    }
  }

  get accessToken() {
    return localStorage.getItem('auth_token');
  }
}
