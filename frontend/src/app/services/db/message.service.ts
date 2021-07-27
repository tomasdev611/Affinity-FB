import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {stringify} from 'querystring';

// import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';

@Injectable()
export class MessageService {
  /**
   *
   * @param http
   * @param router
   */
  instances = [];

  constructor(private http: HttpClient, private router: Router) {}

  addNewInstance(instance) {
    // Check whether same instance already running
    let instanceIndex = this.getIndexOfExistingInstance(instance);
    if (instanceIndex === -1) {
      this.instances.push(instance);
    }
  }

  getIndexOfExistingInstance(instance) {
    let instanceIndex = this.instances.findIndex(inst => {
      if (instance.caregiver) {
        if (
          inst.caregiver &&
          inst.caregiver.SocialSecurityNum === instance.caregiver.SocialSecurityNum
        ) {
          return true;
        }
      } else if (instance.group) {
        if (inst.group && inst.group.GroupId === instance.group.GroupId) {
          return true;
        }
      }
      return false;
    });
    return instanceIndex;
  }
  removeInstance(instance) {
    let instanceIndex = this.getIndexOfExistingInstance(instance);
    if (instanceIndex > -1) {
      this.instances.splice(instanceIndex, 1);
    }
  }

  getAllMessageWithOption(params) {
    return this.http
      .get(`${environment.server}/api/v1/messages?${stringify(params)}`)
      .pipe(map((res: any) => res));
  }

  sendNewMessage(data) {
    return this.http
      .post(environment.server + '/api/v1/messages', data)
      .pipe(map((res: any) => res));
  }

  fetchAllGroups() {
    return this.http
      .get(`${environment.server}/api/v1/messages/groups`)
      .pipe(map((res: any) => res));
  }

  fetchSingleGroup(GroupId) {
    return this.http
      .get(`${environment.server}/api/v1/messages/groups/${GroupId}`)
      .pipe(map((res: any) => res));
  }

  createMessageGroup(data) {
    return this.http
      .post(`${environment.server}/api/v1/messages/groups`, data)
      .pipe(map((res: any) => res));
  }

  updateMessageGroup(GroupId, data) {
    return this.http
      .put(`${environment.server}/api/v1/messages/groups/${GroupId}`, data)
      .pipe(map((res: any) => res));
  }

  deleteMessageGroup(GroupId) {
    return this.http
      .delete(`${environment.server}/api/v1/messages/groups/${GroupId}`)
      .pipe(map((res: any) => res));
  }

  getChatRooms(params) {
    return this.http
      .get(`${environment.server}/api/v1/messages/chatrooms?${stringify(params)}`)
      .pipe(map((res: any) => res));
  }

  getUnreadCount() {
    return this.http
      .get(`${environment.server}/api/v1/messages/unreads`)
      .pipe(map((res: any) => res));
  }
}
