import {Component, OnInit} from '@angular/core';
import {cloneDeep} from 'lodash';
import {select, Store} from '@ngrx/store';
import {Subject, Subscription} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../../services/gaurd/auth.service';
import {NotifierService} from 'angular-notifier';
import * as fromRoot from '../../states/reducers';
import {CACHE_ENABLED} from '../../config';
import {LoadSingleCaregiver, SetCurrentCaregiverSocialSecurityNum} from '../../states/actions/caregiver.actions';
import { RegistrationService } from '../../services/db/registration.service';

const CURRENT_KEY = 'step2';

@Component({
  selector: 'registration-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  SocialSecurityNum: string;
  caregiverDetail: any;

  selected = {
    SocialSecurityNum: '',
    LastName: '',
    FirstName: '',
    MiddleInit: '',
    Address1: '',
    Address2: '',
    City: '',
    County: '',
    State: '',
    Zip: '',
    Driver: '',
    ClassificationID: '',
    DateofBirth: '',
    Email: '',
    Phone1: '',
    Phone2: '',
    Visa: '',
    isVisa: false,
    Felony: '',
    isFelony: false,
  };
  
  counties = [];
  classifications = [];

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
    this.registrationService.getStepDetail(CURRENT_KEY).subscribe((step2) => {
      if (step2 != null) {
        this.initFromCache(step2);
      } else {
        this.initFromPrevious();
      }
    }, () => {});
  }

  initFromCache(data) {
    this.selected = data
  }

  initFromPrevious() {
    let Id = this.registrationService.getSSN();
    if (Id !== ' ' && parseInt(Id) > 0) {
      if (!CACHE_ENABLED && this.SocialSecurityNum !== Id) {
        this.store.dispatch(new LoadSingleCaregiver(Id));
      }
      this.SocialSecurityNum = Id;
      this.store.dispatch(new SetCurrentCaregiverSocialSecurityNum(Id));
    } else {
      this.router.navigate(['/registration/page404']);
    }

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.counties = data.counties;
          this.classifications = data.classifications;
        }
      });
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverDetailMap)
      )
      .subscribe(data => {
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          if (!this.caregiverDetail.personaldata) {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadSingleCaregiver(this.SocialSecurityNum));
            }
          } else {
            this.updateSelected(cloneDeep(this.caregiverDetail.personaldata))
          }
        }
      });
  }

  updateSelected(newValue) {
    const keys = Object.keys(newValue)
    for (const key of keys) {
      if (key in this.selected) {
        this.selected[key] = newValue[key]
      }
    }
  }

  moveToNext() {
    this.registrationService.setStepDetail(CURRENT_KEY, this.selected).subscribe(() => {
      this.router.navigate(['/registration/step3/']);
    }, () => {
      console.log('Unable to store data - accident may be');
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
