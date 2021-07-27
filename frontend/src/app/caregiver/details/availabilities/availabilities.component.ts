import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {UpdateCaregiverAvailabilities} from '../../../states/actions/caregiver.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-caregiver-availabilities',
  templateUrl: './availabilities.component.html',
  styleUrls: ['./availabilities.component.scss']
})
export class AvailabilitiesComponent implements OnInit {
  caregiverDetail: any;

  SocialSecurityNum: string;
  saving: string = '';

  availabilities = [];
  caregiverAvailabilities = [];

  allAvailabilities = [];

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';
  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(private authService: AuthService, private store: Store<any>) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded && this.allAvailabilities !== data.availabilities) {
          this.allAvailabilities = data.availabilities;
          this.populateAvailabilities();
        }
      });
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverSaving)
      )
      .subscribe(data => {
        this.saving = data;
      });
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverDetailMap)
      )
      .subscribe(data => {
        this.SocialSecurityNum = data.currentCaregiverSocialSecurityNum;
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          if (this.caregiverAvailabilities !== this.caregiverDetail.availabilities) {
            this.caregiverAvailabilities = this.caregiverDetail.availabilities;
            this.populateAvailabilities();
          }
        }
      });
  }

  populateAvailabilities() {
    let availabilities = cloneDeep(this.allAvailabilities);
    availabilities = availabilities.filter(a => a.caregiver);
    if (this.caregiverAvailabilities) {
      let caregiverAvailabilities = this.caregiverAvailabilities.map(cl => cl.AvailabilityId);
      availabilities.forEach(l => {
        l.selected = caregiverAvailabilities.includes(l.id);
      });
    }
    this.availabilities = availabilities;
  }

  save() {
    const availabilities = this.availabilities.filter(l => l.selected).map(l => ({id: l.id}));
    this.store.dispatch(
      new UpdateCaregiverAvailabilities({
        SocialSecurityNum: this.SocialSecurityNum,
        data: {availabilities}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
