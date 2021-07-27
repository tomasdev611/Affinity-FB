import {map, takeUntil} from 'rxjs/operators';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {cloneDeep, omit} from 'lodash';

import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {AuthService} from '../../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {AppComponent} from '../../app.component';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import * as fromRoot from '../../states/reducers';
import {
  CreateCommonData,
  UpdateCommonData,
  DeleteCommonData
} from '../../states/actions/common.actions';
import {COMMON_OMIT_FIELD} from '../../common/default';
import {ModalComponent} from '../../library/custom-modal/modal/modal.component';

const OMIT_FIELDS = [...COMMON_OMIT_FIELD];

const DEFAULT_DATA = {
  cfieldName: '',
  showCaregiver: true,
  showClient: true
};

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.css']
})
export class CustomFieldsComponent implements OnInit, AfterViewInit {
  activeModal: ModalComponent;

  saving: string;
  listData = []; // for list

  editRow: any;
  editData: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};

  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private store: Store<any>,
    private appComponent: AppComponent
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
      title: 'Custom Fields',
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
          this.listData = data.customfields;
        }
      });
  }

  ngAfterViewInit() {}
  // call api for add new fields

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

  saveData() {
    if (this.editRow) {
      this.updateData();
    } else {
      this.addNewData();
    }
  }

  addNewData() {
    this.store.dispatch(new CreateCommonData({target: 'customfields', data: this.editData}));
  }

  updateData() {
    this.store.dispatch(
      new UpdateCommonData({
        target: 'customfields',
        idInfo: [this.editRow.cfieldName],
        idFields: ['cfieldName'],
        data: this.editData
      })
    );
  }

  deleteData() {
    this.store.dispatch(
      new DeleteCommonData({
        target: 'customfields',
        idInfo: [this.editRow.cfieldName],
        idFields: ['cfieldName']
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
