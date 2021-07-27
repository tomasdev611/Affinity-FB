import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {
  LoadCaregiverCustomFields,
  UpdateCaregiverCustomFields,
  UpdateCaregiverCustomFieldsAll
} from '../../../states/actions/caregiver.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-customfields',
  templateUrl: './customfields.component.html',
  styleUrls: ['./customfields.component.scss']
})
export class CustomfieldsComponent implements OnInit {
  caregiverDetail: any;

  SocialSecurityNum: string;
  saving: string = '';

  customFields = [];
  caregiverCustomFields = [];

  allCustomFields = [];

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
        if (data.loaded && this.allCustomFields !== data.customfields) {
          this.allCustomFields = data.customfields;
          this.populateCustomFields();
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
        if (!CACHE_ENABLED && this.SocialSecurityNum !== data.currentCaregiverSocialSecurityNum) {
          this.store.dispatch(
            new LoadCaregiverCustomFields(data.currentCaregiverSocialSecurityNum)
          );
        }
        this.SocialSecurityNum = data.currentCaregiverSocialSecurityNum;
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          if (this.caregiverCustomFields !== this.caregiverDetail.customfields) {
            this.caregiverCustomFields = this.caregiverDetail.customfields;
            this.populateCustomFields();
          }
          if (!this.caregiverCustomFields && CACHE_ENABLED) {
            this.store.dispatch(new LoadCaregiverCustomFields(this.SocialSecurityNum));
          }
        }
      });
  }

  populateCustomFields() {
    let cfields = cloneDeep(this.allCustomFields.filter(cf => cf.showCaregiver));
    if (this.caregiverCustomFields) {
      this.caregiverCustomFields.forEach(cf => {
        cfields.forEach(cf1 => {
          if (cf1.cfieldName === cf.cfieldName) {
            cf1.descr = cf.descr;
          }
        });
      });
    }
    this.customFields = cfields;
  }

  save() {
    const customfields = this.customFields.map(l => ({cfieldName: l.cfieldName, descr: l.descr}));
    this.store.dispatch(
      new UpdateCaregiverCustomFieldsAll({
        SocialSecurityNum: this.SocialSecurityNum,
        data: {customfields}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
