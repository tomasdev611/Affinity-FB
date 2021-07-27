import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../services/gaurd/auth.service';
import {NotifierService} from 'angular-notifier';
import { RegistrationService } from '../../services/db/registration.service';

const CURRENT_KEY = 'step3';

@Component({
  selector: 'registration-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {
  SocialSecurityNum: string;
  caregiverDetail: any;

  selected = {
    SocialSecurityNum: '',
    RateLast: '',
    RateDesired: '',
    Available: {
      Overnight: false,
      LiveIn: false,
      Sat: false,
      Sun: false,
    },
    WeekDays: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false
    },
    StartDate: '',
    HearFrom: '',
  };
  
  check_access_on_init = true;
  access_group_id = 'Caregiver Registration';

  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifierService: NotifierService,
    private store: Store<any>,
    private registrationService: RegistrationService
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/registration/page404']);
      }
    }
  }

  ngOnInit() {
    let Id = this.registrationService.getSSN();
    console.log(Id);
    if (Id !== ' ' && parseInt(Id) > 0) {
      this.SocialSecurityNum = Id;
    } else {
      this.router.navigate(['/registration/page404']);
    }

    this.registrationService.getStepDetail(CURRENT_KEY).subscribe((data) => {
      if (data != null) {
        this.initFromCache(data);
      }
    }, () => {});
  }

  initFromCache(data) {
    this.selected = data
  }

  moveToNext() {
    this.registrationService.setStepDetail(CURRENT_KEY, this.selected).subscribe(() => {
      this.router.navigate(['/registration/step4/']);
    }, () => {
      console.log('Unable to store data - may be accident');
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
