import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
// import {cloneDeep, pick} from 'lodash';
import {Subject} from 'rxjs';
import {AuthService} from '../../../services/gaurd/auth.service';
// import {takeUntil} from 'rxjs/operators';
// import {UpdateClientAvailabilities} from '../../../states/actions/client.actions';
// import * as fromRoot from '../../../states/reducers';
// import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-client-service-orders',
  templateUrl: './service-orders.component.html',
  styleUrls: ['./service-orders.component.scss']
})
export class ServiceOrdersComponent implements OnInit {
  clientDetail: any;
  ClientId: string;
  saving: string = '';

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

  ngOnInit() {}

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
