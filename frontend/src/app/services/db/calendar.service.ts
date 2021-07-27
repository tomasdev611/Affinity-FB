import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {stringify} from 'querystring';
import * as moment from 'moment';
// import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';

@Injectable()
export class CalendarService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  fetchCalendarData() {
    let url = environment.server + '/api/v1/calender/data';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchCalendar(calendarTime, ClientId, SocialSecurityNum, type, loadHours = true) {
    //get the calendar month and year from the date
    var calDate = new Date(calendarTime);
    var month = calDate.getMonth() + 1;
    var year = calDate.getFullYear();

    // ====
    // month and year are not used but do not remove will break the functionlity
    // ====
    let random = new Date().getTime();
    // let url =
    //   environment.server +
    //   '/api/v1/calender/' +
    //   month +
    //   '/' +
    //   year +
    //   '/' +
    //   (ClientId == '' ? ' ' : ClientId) +
    //   '/' +
    //   (SocialSecurityNum == '' ? ' ' : SocialSecurityNum) +
    //   '/?time=' +
    //   random +
    //   '&calendarTime=' +
    //   calendarTime +
    //   '&type=' +
    //   type;
    const params: any = {
      type,
      calendarTime: `${moment(calendarTime).format('YYYY-MM-DD')}`,
      loadHours
    };
    if (ClientId) {
      params.ClientId = ClientId;
    }
    if (SocialSecurityNum) {
      params.SocialSecurityNum = SocialSecurityNum;
    }

    // const {ClientId, SocialSecurityNum, calendarTime, type} = req.query;

    // let url = environment.server + '/api/v1/calender/events/' + (selectClient == "" ? " " : selectClient) + "/" + (selectedCaregiver == "" ? " " : selectedCaregiver) + "/?time=" + random + "&calendarTime=" + viewDate + "&type=" + view
    const url = `${environment.server}/api/v1/calender/events/?${stringify(params)}`;
    // let url = `${
    //   environment.server
    // }/api/v1/calender/events?type=${type}&calendarTime=${calendarTime}`;
    // if (ClientId) {
    //   url = `${url}&ClientId=${ClientId}`;
    // }
    // if (SocialSecurityNum) {
    //   url = `${url}&SocialSecurityNum=${SocialSecurityNum}`;
    //   // params.SocialSecurityNum = SocialSecurityNum;
    // }
    return this.http.get(url).pipe(map((res: any) => res));
  }

  createBulkSchedules(data) {
    return this.http
      .post(`${environment.server}/api/v1/calender/bulk`, data)
      .pipe(map((res: any) => res));
  }

  editBulkSchedules(data) {
    return this.http
      .put(`${environment.server}/api/v1/calender/bulk`, data)
      .pipe(map((res: any) => res));
  }

  deleteBulkSchedules(data) {
    return this.http
      .post(`${environment.server}/api/v1/calender/bulk/delete`, data)
      .pipe(map((res: any) => res));
  }
}
