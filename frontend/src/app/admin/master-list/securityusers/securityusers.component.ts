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
  twilioNumber: ''
};

const OMIT_FIELDS = [...COMMON_OMIT_FIELD, 'userName'];

@Component({
  selector: 'app-master-list-securityuser',
  templateUrl: './securityusers.component.html',
  styleUrls: ['./securityusers.component.scss']
})
export class SecurityuserMasterListComponent implements OnInit {
  activeModal: ModalComponent;

  saving: string;
  listData = []; // for list
  editModalTitle = 'Add';
  editRow: any;
  editData: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};
  phoneNumbers = [];
  eligibleNumbers = [];
  userPhoneNumbers = {};

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
      title: 'Security Users',
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
          this.listData = data.securityUsers;
          if (data.securityUsers) {
            this.userPhoneNumbers = data.securityUsers.reduce((obj, cur) => {
              if (cur.twilioNumber) {
                obj[cur.twilioNumber] = cur;
              }
              return obj;
            }, {});
          }
          // this.phoneNumbers = data.phoneNumbers.filter(p => !this.userPhoneNumbers[p.PhoneNumber]);
          this.phoneNumbers = data.phoneNumbers;
        }
      });
  }

  // addDataAction(content) {
  //   this.editRow = null;
  //   this.editData = cloneDeep(DEFAULT_DATA);
  //   this.modalRef = this.modal.open(content, {size: 'lg'});
  // }

  updateDataAction(content, row) {
    this.editRow = row;
    this.editData = cloneDeep(omit(row, OMIT_FIELDS));
    this.editModalTitle = `Edit Security User - ${row.userName}`;
    const self = this;
    if (row.twilioNumber) {
      this.eligibleNumbers = this.phoneNumbers.filter(
        p => !self.userPhoneNumbers[p.PhoneNumber] || row.twilioNumber === p.PhoneNumber
      );
    } else {
      this.eligibleNumbers = this.phoneNumbers.filter(p => !this.userPhoneNumbers[p.PhoneNumber]);
    }
    content.show();
    this.activeModal = content;
  }

  deleteDataAction(content, row) {
    this.editRow = row;
    content.show();
    this.activeModal = content;
  }

  saveData() {
    if (this.editRow) {
      this.updateData();
    } else {
      this.addNewData();
    }
  }

  addNewData() {
    this.store.dispatch(
      new CreateCommonData({target: 'securityUsers', data: this.formattedData(this.editData)})
    );
  }

  formattedData({maximumGroupMemberCount, ...data}) {
    const result = {...data};
    result.maximumGroupMemberCount = parseInt(maximumGroupMemberCount || '0');
    return result;
  }

  updateData() {
    this.store.dispatch(
      new UpdateCommonData({
        target: 'securityUsers',
        idInfo: [this.editRow.userName],
        idFields: ['userName'],
        data: this.formattedData(this.editData)
      })
    );
  }

  deleteData() {
    this.store.dispatch(
      new DeleteCommonData({
        target: 'securityUsers',
        idInfo: [this.editRow.userName],
        idFields: ['userName']
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
