import {Component, OnInit, Input, Inject, OnChanges, SimpleChanges} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/gaurd/auth.service';
import * as fromRoot from '../../../../states/reducers';
import {DOCUMENT} from '@angular/platform-browser';

import {ActivatedRoute} from '@angular/router';

import {CalendarEventTimesChangedEvent} from 'angular-calendar';
import {CalendarService} from '../../../../services/db/calendar.service';

const colors: any = {
  red: {
    primary: '#f9f9f9',
    secondary: '#f9f9f9'
  },
  blue: {
    primary: '#f9f9f9',
    secondary: '#f9f9f9'
  },
  yellow: {
    primary: '#f9f9f9',
    secondary: '#f9f9f9'
  }
};

@Component({
  selector: 'client-overview-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class OverviewCalendarComponent implements OnInit, OnChanges {
  @Input() client: any;

  view = 'month';

  viewDate: Date = new Date();
  calendarOptions: any = {lockClient: true};

  commonCaregivers = [];
  schedules = [];
  selectedClient: String = ' ';
  calendarTitle: string;

  refresh: Subject<any> = new Subject();
  events = [];

  check_access_on_init = true;
  access_group_id = 'Client Data';

  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store<any>,
    private activatedRoute: ActivatedRoute,
    private calendarService: CalendarService,
    // private appComponent: AppComponent,
    @Inject(DOCUMENT) doc: any
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
    }
  }

  // for update Note
  openCalendarEdit(content) {
    content.show();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  clientFormatMatches = (value: any) => value.name || '' || value;

  ngOnInit() {
    this.selectedClient = this.client.ClientId;
    this.calendarOptions.ClientId = this.client.ClientId;
    this.calendarOptions.ClientName = `${this.client.FirstName} ${this.client.LastName}`;

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.commonCaregivers = data.caregivers;
          if (this.schedules && this.schedules.length > 0) {
            this.showMonthData(this.schedules);
          }
        }
      });

    this.fetchSchedules();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.events = [];
    if (this.client) {
      this.selectedClient = this.client.ClientId;
      this.calendarOptions.ClientId = this.client.ClientId;
      this.calendarOptions.ClientName = `${this.client.FirstName} ${this.client.LastName}`;
      this.fetchSchedules();
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    // this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  /**
   * function to get all the calender events for a particualar month
   *
   * @param cb
   */

  showMonthData(data) {
    this.events = [];
    let randomNumber = 1;
    for (let i = 0; i < data.length; i++) {
      const schedule = data[i];
      randomNumber = Math.floor(Math.random() * 3) + 1;

      var start = new Date(data[i].StartTime);
      var end = new Date(data[i].EndTime);
      var start = new Date(start.getTime() + start.getTimezoneOffset() * 60000);
      var end = new Date(end.getTime() + end.getTimezoneOffset() * 60000);

      let diff = end.getTime() - start.getTime();
      diff = diff / (1000 * 60 * 60);
      var t1 = start.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      var t2 = end.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
      let timing = t1 + '-' + t2;
      //timing =t1 ;
      //+ " for " + diff + " hours";
      //var timing = (start.getHours() > 12 ? (start.getHours() - 12) : start.getHours()) + ":" + String(start.getMinutes()).padStart(2, "0") + startA + "-" + (end.getHours() > 12 ? (end.getHours() - 12) : end.getHours()) + ":" + String(end.getMinutes()).padStart(2, "0") + endA;

      //console.log("Start ", start, "END:" + end);
      const caregiver =
        this.commonCaregivers.find(v => v.SocialSecurityNum === schedule.SocialSecNum) || {};

      this.events.push({
        start: start,
        end: end,
        title: `${caregiver.FirstName} ${caregiver.LastName} - ${timing}`,
        color: randomNumber == 1 ? colors.red : randomNumber == 2 ? colors.yellow : colors.blue,
        // actions: this.actions,
        ClientName: this.client.FirstName + ' ' + this.client.LastName,
        serviceName: schedule.Description,
        CaregiverName: caregiver.FirstName + ' ' + caregiver.LastName,
        ClientId: schedule.ClientId,
        SocialSecNum: schedule.SocialSecNum,
        itemName: schedule.itemName,
        StartTime: schedule.StartTime,
        EndTime: schedule.EndTime,
        ServiceCode: schedule.ServiceCode,
        addServiceRequestId: schedule.ServiceRequestId,
        scheduleID: schedule.scheduleID
      });
    }

    this.refresh.next();
    this.calendarTitle = $('.align-self-center > .text-uppercase').text();
  }

  calendarChangeEvent(type) {
    this.fetchSchedules();
  }

  // code for set random background color on calendar events
  backgroundRandomColor(i) {
    if (i % 3 === 0) return 'background_color_first';
    else if (i % 3 === 1) return 'background_color_second';
    return 'background_color_third';
  }

  fetchCalendar(cb) {
    this.calendarService
      .fetchCalendar(this.viewDate, this.selectedClient, '', this.view, false)
      .subscribe(cb);
  }

  fetchSchedules() {
    this.fetchCalendar(data => {
      this.schedules = data.schedules || [];
      this.showMonthData(data.schedules || []);
    });
  }
}
