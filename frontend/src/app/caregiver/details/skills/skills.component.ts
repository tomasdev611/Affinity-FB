import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {UpdateCaregiverSkills} from '../../../states/actions/caregiver.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-caregiver-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  caregiverDetail: any;

  SocialSecurityNum: string;
  saving: string = '';

  skills = [];
  caregiverSkills = [];

  allSkills = [];

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
        if (data.loaded && this.allSkills !== data.skills) {
          this.allSkills = data.skills;
          this.populateSkills();
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
          if (this.caregiverSkills !== this.caregiverDetail.skills) {
            this.caregiverSkills = this.caregiverDetail.skills;
            this.populateSkills();
          }
        }
      });
  }

  populateSkills() {
    let skills = cloneDeep(this.allSkills);
    skills = skills.filter(s => s.caregiver);
    if (this.caregiverSkills) {
      let caregiverSkills = this.caregiverSkills.map(cl => cl.SkillId);
      skills.forEach(l => {
        l.selected = caregiverSkills.includes(l.SkillId);
      });
    }
    this.skills = skills;
  }

  save() {
    const skills = this.skills.filter(l => l.selected).map(l => ({SkillId: l.SkillId}));
    this.store.dispatch(
      new UpdateCaregiverSkills({
        SocialSecurityNum: this.SocialSecurityNum,
        data: {skills}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
