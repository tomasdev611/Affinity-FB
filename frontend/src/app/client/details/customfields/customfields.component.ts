import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {
  LoadClientCustomFields,
  UpdateClientCustomFields,
  UpdateClientCustomFieldsAll
} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-customfields',
  templateUrl: './customfields.component.html',
  styleUrls: ['./customfields.component.scss']
})
export class CustomfieldsComponent implements OnInit {
  clientDetail: any;

  ClientId: string;
  saving: string = '';

  customFields = [];
  clientCustomFields = [];

  allCustomFields = [];

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
        if (data.loaded && this.allCustomFields !== data.customfields) {
          this.allCustomFields = data.customfields;
          this.populateCustomFields();
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
        if (!CACHE_ENABLED && this.ClientId !== data.currentClientId) {
          this.store.dispatch(new LoadClientCustomFields(data.currentClientId));
        }
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          if (this.clientCustomFields !== this.clientDetail.customfields) {
            this.clientCustomFields = this.clientDetail.customfields;
            this.populateCustomFields();
          }
          if (!this.clientCustomFields && CACHE_ENABLED) {
            this.store.dispatch(new LoadClientCustomFields(this.ClientId));
          }
        }
      });
  }

  populateCustomFields() {
    let cfields = cloneDeep(this.allCustomFields.filter(cf => cf.showClient));
    if (this.clientCustomFields) {
      this.clientCustomFields.forEach(cf => {
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
      new UpdateClientCustomFieldsAll({
        ClientId: this.ClientId,
        data: {customfields}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
