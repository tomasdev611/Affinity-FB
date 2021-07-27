import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {cloneDeep, omit} from 'lodash';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AuthService} from '../../../services/gaurd/auth.service';
import * as fromRoot from '../../../states/reducers';
import {
  CreateCommonData,
  UpdateCommonData,
  DeleteCommonData
} from '../../../states/actions/common.actions';
import {COMMON_OMIT_FIELD} from '../../../common/default';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';

const DEFAULT_DATA = {
  PhoneNumber: ''
};

const OMIT_FIELDS = [...COMMON_OMIT_FIELD, 'id'];

@Component({
  selector: 'app-master-list-phonenumbers',
  templateUrl: './phonenumbers.component.html',
  styleUrls: ['./phonenumbers.component.scss']
})
export class PhonenumberMasterListComponent implements OnInit {
  activeModal: ModalComponent;

  saving: string;
  listData = []; // for list

  userPhoneNumbers = {};

  editRow: any;
  editData: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private store: Store<any>
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  ngOnInit() {
    let link = this.location.path();
    this.authService.checkAndAddLink({
      link,
      title: 'Phone Numbers',
      type: 'admin',
      canClose: true
    });
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommonSaving)
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
          this.listData = data.phoneNumbers;
          if (data.securityUsers) {
            this.userPhoneNumbers = data.securityUsers.reduce((obj, cur) => {
              if (cur.twilioNumber) {
                obj[cur.twilioNumber] = cur;
              }
              return obj;
            }, {});
          }
        }
      });
  }

  addDataAction(content) {
    this.editRow = null;
    this.editData = cloneDeep(DEFAULT_DATA);
    content.show();
    this.activeModal = content;
  }

  updateDataAction(content, row) {
    this.editRow = row;
    this.editData = cloneDeep(omit(row, OMIT_FIELDS));
    content.show();
    this.activeModal = content;
  }

  deleteDataAction(content, row) {
    this.editRow = row;
    content.show();
    this.activeModal = content;
  }

  getCurrentUserForPhoneNumber(row) {
    if (this.userPhoneNumbers[row.PhoneNumber]) {
      return this.userPhoneNumbers[row.PhoneNumber].userName;
    }
    return '';
  }

  saveData() {
    if (this.editRow) {
      this.updateData();
    } else {
      this.addNewData();
    }
  }

  addNewData() {
    this.editData.PhoneNumber = this.editData.PhoneNumber.split(' ').join('');
    if (!this.editData.PhoneNumber) {
      return;
    }
    this.store.dispatch(new CreateCommonData({target: 'phoneNumbers', data: this.editData}));
  }

  updateData() {
    this.editData.PhoneNumber = this.editData.PhoneNumber.split(' ').join('');
    this.store.dispatch(
      new UpdateCommonData({
        target: 'phoneNumbers',
        idInfo: [this.editRow.id],
        idFields: ['id'],
        data: this.editData
      })
    );
  }

  deleteData() {
    this.store.dispatch(
      new DeleteCommonData({
        target: 'phoneNumbers',
        idInfo: [this.editRow.id],
        idFields: ['id']
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
