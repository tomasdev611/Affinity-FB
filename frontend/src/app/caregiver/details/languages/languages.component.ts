import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {UpdateCaregiverLanguages} from '../../../states/actions/caregiver.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-caregiver-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  caregiverDetail: any;

  SocialSecurityNum: string;
  saving: string = '';

  languages = [];
  caregiverLanguages = [];

  allLanguages = [];

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
        if (data.loaded && this.allLanguages !== data.languages) {
          this.allLanguages = data.languages;
          this.populateLanguages();
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
          if (this.caregiverLanguages !== this.caregiverDetail.languages) {
            this.caregiverLanguages = this.caregiverDetail.languages;
            this.populateLanguages();
          }
        }
      });
  }

  populateLanguages() {
    let languages = cloneDeep(this.allLanguages);
    if (this.caregiverLanguages) {
      let caregiverLanguages = this.caregiverLanguages.map(cl => cl.LanguageId);
      languages.forEach(l => {
        l.selected = caregiverLanguages.includes(l.id);
      });
    }
    this.languages = languages;
  }

  save() {
    const languages = this.languages.filter(l => l.selected).map(l => ({id: l.id}));
    this.store.dispatch(
      new UpdateCaregiverLanguages({
        SocialSecurityNum: this.SocialSecurityNum,
        data: {languages}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
