import {debounceTime, map, distinctUntilChanged} from 'rxjs/operators';
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Input
} from '@angular/core';
import {cloneDeep, omit} from 'lodash';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';
import * as fromRoot from '../../states/reducers';
import {NotifierService} from 'angular-notifier';

import {DOCUMENT} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';

import {ActivatedRoute, Params, ROUTER_CONFIGURATION} from '@angular/router';
import {AppComponent} from '../../app.component';
import * as html2canvas from 'html2canvas';
import {Router} from '@angular/router';
import {ElementRef} from '@angular/core';

//import * as jsPDF from 'jspdf'
import 'jspdf-autotable';

//declare var jsPDF: any; // Important
declare let jsPDF;

import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {CaregiverService} from '../../services/db/caregiver.service';
import {CalendarService} from '../../services/db/calendar.service';
import {ClientService} from '../../services/db/client.service';
import {AuthService} from '../../services/gaurd/auth.service';

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

const scheduleDefault = {
  SocialSecNum: null,
  ClientId: null,
  // Date: '',
  StartTime: '',
  EndTime: '',

  ServiceCode: null,
  // IsConfirmed: {type: ['boolean', 'null']},

  // serviceRequestId: {type: ['integer', 'null']},
  itemName: '',
  AllFutureDates: false

  // notes: {type: ['string', 'null'], maxLength: 1000},
  // scheduleID: {type: 'integer'},
  // timematch: {type: ['boolean', 'null']},
  // int_missedstatus: {type: ['integer', 'null']}
};

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

@Component({
  selector: 'calendar-component',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements AfterViewInit {
  @Input() options: any;

  @ViewChild('myDiv') myDiv: ElementRef;
  triggerTypeaheadClick() {
    let el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
    el.click();
  }

  view = 'month';

  is_loading = false;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  lockedCaregiverName: String = '';
  lockedClientName: String = '';

  commonClients = [];
  commonCaregivers = [];
  clientHours: any = {};
  caregiverHours: any = {};
  clients = [];
  caregivers = [];
  service = []; // for store services
  avialableServices: any = [];

  //vars to hold the calendar data
  allCalenderData;
  dateformat = new Date();
  current_month: any;
  current_day: any;
  current_year: any;

  editSchedule: any;
  selectedSchedule: any;

  selectedCaregiver: String;
  selectClient: String;
  addServiceRequestId = 1;

  weekOptions = {};

  createNew = true;

  items: [{bgcolor: '#f9f9f9'}, {bgcolor: '#f9f9f9'}, {bgcolor: '#f9f9f9'}];

  // for hold calender json data according to week , month yearly

  jsonCalenderData = [];

  // for hold calendar title
  calendarTitle: string;

  refresh: Subject<any> = new Subject();

  events = [];

  activeDayIsOpen = true;

  caregiver_Name: any;
  // difine for calendar events
  getCurrentMonth: any;
  getCurrentYear: any;
  calendarWeekNum: any;
  calendarYear: any;

  isAddCaregiverEnabled: boolean = true; // for manage responce
  showDownloadButton: boolean;

  check_access_on_init = true;
  access_group_id = 'Scheduling - Calendar';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private caregiverService: CaregiverService,
    private calendarService: CalendarService,
    private notifierService: NotifierService,
    private clientService: ClientService,
    private authService: AuthService,
    private store: Store<any>,
    private appComponent: AppComponent,
    @Inject(DOCUMENT) doc: any
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  // Added
  clientFormatMatches = (value: any) => value.name || '' || value;
  searchClient = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term === ''
          ? []
          : this.clients
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  caregiverFormatMatches = (value: any) => value.name || '' || value;
  searchCaregiver = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term === ''
          ? []
          : this.caregivers
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  serviceFormatMatches = (value: any) => value.name || '';
  searchService = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term =>
        term === ''
          ? []
          : this.avialableServices
              .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  generateClientsCaregivers() {
    let caregivers = this.commonCaregivers.map(c => ({
      name: `${c.FirstName} ${c.LastName} (${this.caregiverHours[c.SocialSecurityNum] || 0} hrs)`,
      id: c.SocialSecurityNum
    }));
    this.caregivers = caregivers;
    // if (this.SocialSecNum !== '' || this.SocialSecNum !== undefined) {
    //   this.caregiver = this.SocialSecNum;
    // }

    let clients = this.commonClients.map(c => ({
      name: `${c.FirstName} ${c.LastName} (${this.clientHours[c.ClientId] || 0} hrs)`,
      id: c.ClientId
    }));
    this.clients = clients;
    if (this.options.lockCaregiver) {
      const caregiver = caregivers.find(c => c.id === this.options.SocialSecurityNum);
      if (caregiver) {
        this.lockedClientName = caregiver.name;
      }
    }
    if (this.options.lockClient) {
      const client = clients.find(c => c.id === this.options.ClientId);
      if (client) {
        this.lockedClientName = client.name;
      }
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.avialableServices = data.services.map(item => ({
            name: item.Description,
            id: item.ServiceCode
          }));
          this.commonCaregivers = data.caregivers;
          this.commonClients = data.clients;
          this.generateClientsCaregivers();
          if (this.jsonCalenderData) {
            this.showMonthData(this.jsonCalenderData);
          }
        }
      });
    if (this.options) {
      if (this.options.ClientId) {
        this.selectClient = this.options.ClientId;
      }
      // if (this.options.ClientName) {
      //   this.username = this.options.ClientName;
      // }
      if (this.options.SocialSecurityNum) {
        this.selectedCaregiver = this.options.SocialSecurityNum;
      }
      // if (this.options.CaregiverName) {
      //   this.caregiver = this.options.CaregiverName;
      // }
    }
    this.fetchSchedules(true);
  }

  ngAfterViewInit() {
    // if (this.selectClient === ' ' && this.SocialSecNum === undefined) {
    //   this.appComponent.leftLink();
    // }
  }

  newEventAction(content, row) {
    if (this.options.readonly) {
      return;
    }
    this.editSchedule = {
      ...cloneDeep(scheduleDefault),
      SocialSecNum: this.selectedCaregiver,
      ClientId: this.selectClient
    };

    this.weekOptions = WEEKDAYS.reduce((obj, cur) => {
      obj[cur] = 0;
      return obj;
    }, {});
    this.createNew = true;
    content.show();
  }

  // for update month event
  updateEventAction(content, event, title) {
    if (this.options.readonly) {
      return;
    }
    if (!this.acl_allow.update) {
      return;
    }
    this.selectedSchedule = {
      ...cloneDeep(event),
      StartTime: event.StartTime.substring(0, 19),
      EndTime: event.EndTime.substring(0, 19)
    };
    this.weekOptions = WEEKDAYS.reduce((obj, cur) => {
      obj[cur] = 0;
      return obj;
    }, {});

    this.editSchedule = cloneDeep(omit(event, 'StartTime', 'EndTime'));
    this.editSchedule.FromDate = event.StartTime.substring(0, 10);
    this.editSchedule.ToDate = event.StartTime.substring(0, 10);
    this.createNew = false;

    content.show();
  }

  zeroPadded(val) {
    if (val >= 10) return val;
    else return '0' + val;
  }

  /**
   * function to get all the calender events for a particualar month
   *
   * @param cb
   */
  fetchCalendar(loadHours = true, cb) {
    this.calendarService
      .fetchCalendar(this.viewDate, this.selectClient, this.selectedCaregiver, this.view, loadHours)
      .subscribe(cb);
  }

  showMonthData(data) {
    this.events = [];
    let randomNumber = 1;
    for (let i = 0; i < data.length; i++) {
      const schedule = data[i];
      randomNumber = Math.floor(Math.random() * 3) + 1;

      var start = new Date(schedule.StartTime);
      var end = new Date(schedule.EndTime);
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
      const client = this.commonClients.find(v => v.ClientId === schedule.ClientId) || {};
      const caregiver =
        this.commonCaregivers.find(v => v.SocialSecurityNum === schedule.SocialSecNum) || {};

      this.events.push({
        start: start,
        end: end,
        title: `(${caregiver.FirstName} ${caregiver.LastName}) ${client.FirstName} ${
          client.LastName
        } - ${timing}`,
        color: randomNumber == 1 ? colors.red : randomNumber == 2 ? colors.yellow : colors.blue,
        // actions: this.actions,
        CaregiverName: caregiver.FirstName + ' ' + caregiver.LastName,
        serviceName: schedule.Description,
        ClientName: client.FirstName + ' ' + client.LastName,
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
    this.fetchSchedules(true);
  }

  selectedClient() {
    if (!this.selectedCaregiver && !this.selectClient) {
      this.showMonthData([]);
      this.jsonCalenderData = [];
    } else {
      this.fetchSchedules(false);
    }
  }

  selectedCareGiver(event) {
    if (!this.selectedCaregiver && !this.selectClient) {
      this.showMonthData([]);
      this.jsonCalenderData = [];
    } else {
      this.fetchSchedules(false);
      this.showDownloadButton = true;
    }
  }

  convertTime(time1, flag) {
    var isotime = new Date(new Date(time1).toISOString());
    if (flag) {
      var fixedtime = new Date(isotime.getTime() - time1.getTimezoneOffset() * 60000);
    } else {
      var fixedtime = new Date(isotime.getTime() - time1.getTimezoneOffset());
    }
    var formatedMysqlString = fixedtime
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    return formatedMysqlString;
  }

  getDatesStack(from, to, days) {
    var dateArray = new Array();
    var startDate: any;
    var stopDate: any;

    startDate = new Date(from);
    stopDate = new Date(to);

    if (startDate > stopDate || startDate == stopDate) {
      alert('End Date must be greater than Start Date');
      return {s: new Array(), e: new Array()};
    }

    // is next day allow to create overlapping event for next day
    // e.g. 10/11/2018 22:00 - 14/11/2018 03:00
    let is_next_day = this.isNextDay(startDate, stopDate);
    // set a stack of all dates that are selected
    // if 10-18 selected, make stack of all dates.
    var currentDate = startDate;

    while (currentDate <= new Date(to)) {
      dateArray.push(currentDate);
      var dat = new Date(currentDate.valueOf());
      currentDate = new Date(dat.setDate(dat.getDate() + 1));
    }

    var dateObject = {s: new Array(), e: new Array()};
    var startStack = new Array();
    var endStack = new Array();
    var i;
    for (i = 0; i < dateArray.length; i++) {
      var $day = new Date(dateArray[i]).getDay();
      var a = days.indexOf($day);
      if (a > -1) {
        var isotime = new Date(new Date(dateArray[i]).toISOString());
        var fixedtime = new Date(
          isotime.getTime() - new Date(dateArray[i]).getTimezoneOffset() * 60000
        );
        var formatedMysqlString = fixedtime
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ');
        var fixedtime_nextday = undefined;

        // if overlapping to next day, increase enddate by 1 day
        if (is_next_day == true) {
          //do not do last one so length -1
          if (i < dateArray.length) {
            fixedtime_nextday = new Date(dateArray[i]);
            // on local i had to + 1 but on client, we dont have to
            // fixedtime_nextday.setDate(fixedtime.getDate() + 1);
            fixedtime_nextday.setDate(fixedtime.getDate());
            var formatedMysqlString2 = fixedtime_nextday
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ');
            startStack.push(formatedMysqlString.slice(0, 10) + ' ' + from.slice(11, 20));
            endStack.push(formatedMysqlString2.slice(0, 10) + ' ' + to.slice(11, 20));
          }
        } else {
          startStack.push(formatedMysqlString.slice(0, 10) + ' ' + from.slice(11, 20));
          endStack.push(formatedMysqlString.slice(0, 10) + ' ' + to.slice(11, 20));
        }
      }
    }
    dateObject.s = startStack;
    dateObject.e = endStack;
    return dateObject;
  }

  isNextDay(from, to) {
    let newto = to;
    newto.setDate(from.getDate());
    newto.setMonth(from.getMonth());

    if (newto.getTime() < from.getTime()) {
      return true;
    }
    return false;
  }

  addCalendarEvent(content) {
    try {
      //prepare the data
      var weekstack = [];

      WEEKDAYS.forEach((day, index) => {
        if (this.weekOptions[day]) {
          weekstack.push(index);
        }
      });

      var xst = new Date(this.editSchedule.StartTime);
      xst.setSeconds(0);
      var xet = new Date(this.editSchedule.EndTime);
      xet.setSeconds(0);

      var st = this.convertTime(xst, true);
      var et = this.convertTime(xet, true);

      var dates = this.getDatesStack(st, et, weekstack);
      var i;
      if (dates.s.length === 0) {
        this.notifierService.notify('warning', 'No dates match from the input');
        return;
      }
      let row = {
        SocialSecNum: this.editSchedule.SocialSecNum,
        ClientId: this.editSchedule.ClientId,
        StartTimes: dates.s,
        EndTimes: dates.e,
        ServiceCode: this.editSchedule.ServiceCode,
        serviceRequestId: this.addServiceRequestId == undefined ? 1 : 1,
        itemName: this.editSchedule.itemName
      };
      this.is_loading = true;

      this.calendarService.createBulkSchedules(row).subscribe(
        data => {
          this.fetchSchedules(true);
          content.hide();
          this.is_loading = false;
        },
        error => {
          this.is_loading = false;
        }
      );
    } catch (error) {
      console.error(error);
      this.is_loading = false;
      this.notifierService.notify('warning', `${error}`);
    }
  }

  editCalendarEvent(content) {
    //prepare the data
    try {
      var weekstack = [];
      WEEKDAYS.forEach((day, index) => {
        if (this.weekOptions[day]) {
          weekstack.push(index);
        }
      });
      // if (weekstack.length === 0) {
      //   this.notifierService.notify('error', 'At least one week day needs to be selected');
      //   return;
      // }
      if (
        !this.editSchedule.ClientId ||
        !this.editSchedule.SocialSecNum ||
        !this.editSchedule.itemName ||
        !this.editSchedule.ServiceCode
      ) {
        this.notifierService.notify('error', 'Some params are missing');
        return;
      }
      this.is_loading = true;

      let row = {
        SocialSecNum: this.selectedSchedule.SocialSecNum,
        ClientId: this.selectedSchedule.ClientId,
        payroll: this.editSchedule.itemName,
        StartTime: this.selectedSchedule.StartTime,
        EndTime: this.selectedSchedule.EndTime,
        AllFutureDates: this.editSchedule.AllFutureDates,
        weekDays: weekstack,
        // StartTime: dates.s[i],
        // EndTime: dates.e[i],
        NewCaregiverSSN: this.editSchedule.SocialSecNum,
        NewStartTime: this.editSchedule.StartTime,
        NewEndTime: this.editSchedule.EndTime,
        NewFromDate: this.editSchedule.FromDate,
        NewToDate: this.editSchedule.ToDate,
        ServiceCode: this.editSchedule.ServiceCode,
        serviceRequestId: this.addServiceRequestId == undefined ? 1 : 1,
        itemName: this.editSchedule.itemName
      };

      this.calendarService.editBulkSchedules(row).subscribe(
        data => {
          //alert('ok');
          this.is_loading = false;
          this.fetchSchedules(true);
          content.hide();
        },
        error => {
          this.is_loading = false;
        }
      );
    } catch (error) {
      console.error(error);
      this.is_loading = false;
      this.notifierService.notify('warning', `${error}`);
    }
  }

  deleteCalendarEvent(content) {
    //prepare the data
    try {
      this.is_loading = true;
      var weekstack = [];
      WEEKDAYS.forEach((day, index) => {
        if (this.weekOptions[day]) {
          weekstack.push(index);
        }
      });

      var st = this.convertTime(new Date(this.selectedSchedule.StartTime), true);
      var et = this.convertTime(new Date(this.selectedSchedule.EndTime), true);

      var dates = this.getDatesStack(st, et, weekstack);

      let data = {
        SocialSecNum: this.selectedSchedule.SocialSecNum,
        ClientId: this.selectedSchedule.ClientId,
        StartTime: this.selectedSchedule.StartTime,
        EndTime: this.selectedSchedule.EndTime,
        weekDays: weekstack,
        AllFutureDates: this.editSchedule.AllFutureDates,
        FromDate: this.editSchedule.FromDate,
        ToDate: this.editSchedule.ToDate
      };

      this.calendarService.deleteBulkSchedules(data).subscribe(
        data => {
          //alert('ok');
          this.is_loading = false;
          this.fetchSchedules(true);
          content.hide();
        },
        error => {
          this.is_loading = false;
        }
      );
    } catch (error) {
      this.is_loading = false;
      console.error(error);
      this.notifierService.notify('warning', `${error}`);
    }
  }

  // for closing the modal when move another component
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //  for convert json to pdf and download pdf file on click of button
  private download(): void {
    //alert(this.getWeekNumber(this.dateformat));
    var columns = ['Starts', 'Ends', 'Description', 'Client', 'Notes'];
    var rows = [];
    for (var i = 0; i < this.jsonCalenderData.length; i++) {
      let obj = [];
      this.jsonCalenderData[i].StartTime = new Date(this.jsonCalenderData[i].StartTime)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      this.jsonCalenderData[i].EndTime = new Date(this.jsonCalenderData[i].EndTime)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
      obj.push(this.jsonCalenderData[i].StartTime);
      obj.push(this.jsonCalenderData[i].EndTime);
      const service = this.avialableServices.find(
        s => s.id === this.jsonCalenderData[i].ServiceCode
      );
      obj.push(service ? service.name : this.jsonCalenderData[i].ServiceCode);
      const client = this.commonClients.find(s => s.ClientId === this.jsonCalenderData[i].ClientId);
      obj.push(client ? client.FirstName : '');
      obj.push(this.jsonCalenderData[i].notes);
      rows.push(obj);
    }
    // Only pt supported (not mm or in)
    var doc = new jsPDF('p', 'pt');
    //doc.autoTable(columns, rows);
    let temp = this.caregiver_Name;
    console.log('temp:  ....', temp);
    doc.autoTable(columns, rows, {
      styles: {fillColor: [100, 255, 255]},
      columnStyles: {
        id: {fillColor: 255}
      },
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text('Schedules for ' + temp + ' Visits by all Clients', 40, 30);
        doc.text('Schedules for ', 40, 30);
      }
    });
    doc.save('table.pdf');
  }

  // code for set random background color on calendar events
  backgroundRandomColor(i) {
    if (i % 3 === 0) return 'background_color_first';
    else if (i % 3 === 1) return 'background_color_second';
    return 'background_color_third';
  }

  //Take calender screenshot
  download_month() {
    html2canvas(document.getElementById('month')).then(function(canvas) {
      var img = canvas.toDataURL('image/png');
      // //console.log($(".align-self-center > .text-uppercase").text());
      // var doc = new jsPDF("p", "mm", [210, 297 + 20]);
      // var width = doc.internal.pageSize.width;
      // var height = doc.internal.pageSize.height;
      // doc.addImage(img, 'JPEG', 0, 20, width, height - 20);
      // doc.text((width / 2) - 20, 8, $(".align-self-center > .text-uppercase").text()); //doc.text(y,x,'string')
      // doc.save($(".align-self-center > .text-uppercase").text() + '.pdf');
      var i = new Image();

      i.onload = function() {
        //alert(i.width + ", " + i.height);
        let type = i.width / i.height > 0 ? 'p' : 'l';
        var doc = new jsPDF(type, 'px', [i.width, i.height]);
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;
        doc.addImage(img, 'JPEG', 0, 40, width, height - 40);
        doc.text(width / 2, 20, $('.align-self-center > .text-uppercase').text()); //doc.text(y,x,'string')
        doc.save($('.align-self-center > .text-uppercase').text() + '.pdf');
      };

      i.src = img;
    });
  }

  //Download week screenshot
  download_week() {
    html2canvas(document.getElementById('week')).then(function(canvas) {
      var img = canvas.toDataURL('image/png');

      var i = new Image();

      i.onload = function() {
        //alert(i.width + ", " + i.height);
        let type = i.width / i.height > 0 ? 'l' : 'p';
        var doc = new jsPDF(type, 'px', [i.width, i.height]);
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;
        doc.addImage(img, 'JPEG', 0, 40, width, height - 40);
        doc.text(width / 2, 20, $('.align-self-center > .text-uppercase').text()); //doc.text(y,x,'string')
        doc.save($('.align-self-center > .text-uppercase').text() + '.pdf');
      };
      i.src = img;
    });
  }

  //Download day screenshot
  download_day() {
    html2canvas(document.getElementById('day')).then(function(canvas) {
      var img = canvas.toDataURL('image/png');
      // var doc = new jsPDF("p", "mm", [210, 297 + 20]);
      // var width = doc.internal.pageSize.width;
      // var height = doc.internal.pageSize.height;
      // doc.addImage(img, 'JPEG', 0, 20, width, height - 20);
      // doc.text((width / 2) - 20, 8, $(".align-self-center > .text-uppercase").text()); //doc.text(y,x,'string')
      // doc.save($(".align-self-center > .text-uppercase").text() + '.pdf');

      var i = new Image();

      i.onload = function() {
        //alert(i.width + ", " + i.height);
        let type = i.width / i.height > 0 ? 'p' : 'l';
        var doc = new jsPDF(type, 'px', [i.width, i.height]);
        var width = doc.internal.pageSize.width;
        var height = doc.internal.pageSize.height;
        doc.addImage(img, 'JPEG', 0, 40, width, height - 40);
        doc.text(width / 2, 20, $('.align-self-center > .text-uppercase').text()); //doc.text(y,x,'string')
        doc.save($('.align-self-center > .text-uppercase').text() + '.pdf');
      };

      i.src = img;
    });
  }

  fetchSchedules(loadHours = true) {
    // if (this.selectClient || this.selectedCaregiver) {
    //alert("" + this.selectClient + "" + this.selectedCaregiver);
    this.fetchCalendar(loadHours, data => {
      // to store all the json data in to array
      // for (var i = 0; i <= data.schedules.length; i++) {
      if (data.schedules) {
        this.jsonCalenderData = data.schedules;
        this.showMonthData(data.schedules);
      } else {
        this.jsonCalenderData = [];
        this.showMonthData([]);
      }
      if (data.clientHours) {
        this.clientHours = data.clientHours;
        this.caregiverHours = data.caregiverHours;
        this.generateClientsCaregivers();
      }
      // }
    });
    // }
  }
}
