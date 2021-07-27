import {Component, ViewEncapsulation, ViewChild, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {LoadClientVisits} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CACHE_ENABLED} from '../../../config';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.scss']
})
export class VisitsComponent implements OnInit {
  clientDetail: any;
  ClientId: string;

  visitData = []; // for store client visit history
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        if (!CACHE_ENABLED && this.ClientId !== data.currentClientId) {
          this.store.dispatch(new LoadClientVisits(data.currentClientId));
        }
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          if (this.clientDetail.visits) {
            this.visitData = this.clientDetail.visits;
          } else {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadClientVisits(this.ClientId));
            }
          }
        }
      });
  }

  // for closing the modal when move another component
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
