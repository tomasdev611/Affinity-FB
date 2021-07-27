import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
import {takeUntil} from 'rxjs/operators';
import {UpdateClientAvailabilities} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-client-availabilities',
  templateUrl: './availabilities.component.html',
  styleUrls: ['./availabilities.component.scss']
})
export class AvailabilitiesComponent implements OnInit {
  clientDetail: any;

  ClientId: string;
  saving: string = '';

  availabilities = [];
  clientAvailabilities = [];

  allAvailabilities = [];

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
        if (data.loaded && this.allAvailabilities !== data.availabilities) {
          this.allAvailabilities = data.availabilities;
          this.populateAvailabilities();
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
          if (this.clientAvailabilities !== this.clientDetail.availabilities) {
            this.clientAvailabilities = this.clientDetail.availabilities;
            this.populateAvailabilities();
          }
        }
      });
  }

  populateAvailabilities() {
    let availabilities = cloneDeep(this.allAvailabilities);
    availabilities = availabilities.filter(a => a.client);
    if (this.clientAvailabilities) {
      let clientAvailabilities = this.clientAvailabilities.map(cl => cl.AvailabilityId);
      availabilities.forEach(l => {
        l.selected = clientAvailabilities.includes(l.id);
      });
    }
    this.availabilities = availabilities;
  }

  save() {
    const availabilities = this.availabilities.filter(l => l.selected).map(l => ({id: l.id}));
    this.store.dispatch(
      new UpdateClientAvailabilities({
        ClientId: this.ClientId,
        data: {availabilities}
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
