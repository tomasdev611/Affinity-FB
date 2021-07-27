import {Component, ChangeDetectionStrategy, AfterViewInit} from '@angular/core';

import {ActivatedRoute, Params, ROUTER_CONFIGURATION} from '@angular/router';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleCalendarComponent implements AfterViewInit {
  showCalendar = false;
  calendarOptions: any = {};
  ClientId: String;
  SocialSecurityNum: String;

  constructor(
    private activatedRoute: ActivatedRoute // private router: Router, // private authService: AuthService,
  ) {
    // if (this.check_access_on_init) {
    //   this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
    //   if (!this.acl_allow.read) {
    //     this.router.navigate(['/admin/page404']);
    //   }
    // }
  }

  ngOnInit() {
    // subscribe to router event  .......    coming from  client
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['userID']) {
        this.calendarOptions.ClientId = params['userID'];
        this.calendarOptions.ClientName = params['username'];
      }

      if (params['ssn']) {
        this.calendarOptions.SocialSecurityNum = params['ssn'];
        this.calendarOptions.CaregiverName = params['caregivername'];
      }
      this.showCalendar = true;
    });
  }

  ngAfterViewInit() {}
}
