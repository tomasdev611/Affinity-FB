import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {UpdateClientSkills} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-client-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  clientDetail: any;

  ClientId: string;
  saving: string = '';

  skills = [];
  clientSkills = [];

  allSkills = [];

  check_access_on_init = true;
  access_group_id = 'Client Data';
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
        select(fromRoot.getClientSaving)
      )
      .subscribe(data => {
        this.saving = data;
      });
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          if (this.clientSkills !== this.clientDetail.skills) {
            this.clientSkills = this.clientDetail.skills;
            this.populateSkills();
          }
        }
      });
  }

  populateSkills() {
    let skills = cloneDeep(this.allSkills);
    skills = skills.filter(s => s.client);
    if (this.clientSkills) {
      let clientSkills = this.clientSkills.map(cl => cl.skillId);
      skills.forEach(l => {
        l.selected = clientSkills.includes(l.SkillId);
      });
    }
    this.skills = skills;
  }

  save() {
    const skills = this.skills.filter(l => l.selected).map(l => ({SkillId: l.SkillId}));
    this.store.dispatch(
      new UpdateClientSkills({
        ClientId: this.ClientId,
        data: {skills}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
