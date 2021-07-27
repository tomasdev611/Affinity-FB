import {Component, OnInit, Input} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {omit, cloneDeep} from 'lodash';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ModalComponent} from '../../../../library/custom-modal/modal/modal.component';
import {AuthService} from '../../../../services/gaurd/auth.service';
import {ClientService} from '../../../../services/db/client.service';

import * as fromRoot from '../../../../states/reducers';
// import {
//   UpdateSingleClient,
//   CreateSingleClient
// } from '../../../states/actions/client.actions';

@Component({
  selector: 'client-overview-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class OverviewListComponent implements OnInit {
  @Input() client: any;
  saving: string = '';

  ClientId: string;
  filesToUpload: Array<File>;
  activeModal: ModalComponent;

  availabilities = [];
  languages = [];
  skills = [];
  customFields = [];
  // for close modal

  // for check modal open or close
  checkModalStatus: boolean = false;

  check_access_on_init = true;
  access_group_id = 'Client Data';

  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private clientService: ClientService,
    private authService: AuthService,
    private store: Store<any>
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientSaving)
      )
      .subscribe(data => {
        if (this.saving === 'saving' && data === 'success') {
          if (this.activeModal) {
            this.activeModal.hide();
            this.activeModal = null;
          }
        }
        this.saving = data;
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.availabilities = data.availabilities;
          this.languages = data.languages;
          this.skills = data.skills;
          this.customFields = data.customfields;
        }
      });
  }

  openManageCustomFields(content) {
    content.show();
    this.activeModal = content;
  }

  openManageLanguages(content) {
    content.show();
    this.activeModal = content;
  }

  openManageSkills(content) {
    content.show();
    this.activeModal = content;
  }
  openManageAvailabilities(content) {
    content.show();
    this.activeModal = content;
  }

  getName(collection, id, field = 'name') {
    if (!collection) {
      return '';
    }
    let info = collection.find(c => c.id === id);
    if (info) {
      return info[field];
    }
    return '';
  }

  getSkillName(collection, SkillId) {
    if (!collection) {
      return '';
    }
    let info = collection.find(c => c.SkillId === SkillId);
    if (info) {
      return info.Description;
    }
    return '';
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
