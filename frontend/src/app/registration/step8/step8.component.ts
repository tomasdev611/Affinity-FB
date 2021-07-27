import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../services/gaurd/auth.service';
import {NotifierService} from 'angular-notifier';
import { RegistrationService } from '../../services/db/registration.service';

const CURRENT_KEY = 'step8';

@Component({
  selector: 'registration-step8',
  templateUrl: './step8.component.html',
  styleUrls: ['./step8.component.scss']
})
export class Step8Component implements OnInit {
  SocialSecurityNum: string;
  caregiverDetail: any;

  selected = {
    Signature: '',
    DateSign: ''
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
      this.notifierService.notify('error', 'Not implemented yet');
    }, () => {
      console.log('Unable to store data - may be accident');
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
