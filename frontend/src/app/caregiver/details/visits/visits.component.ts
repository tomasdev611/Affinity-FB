import {Component, ViewEncapsulation, ViewChild, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {LoadCaregiverVisits} from '../../../states/actions/caregiver.actions';
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
  caregiverDetail: any;
  SocialSecurityNum: string;

  visitData = []; // for store caregiver visit history
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverDetailMap)
      )
      .subscribe(data => {
        if (!CACHE_ENABLED && this.SocialSecurityNum !== data.currentCaregiverSocialSecurityNum) {
          this.store.dispatch(new LoadCaregiverVisits(data.currentCaregiverSocialSecurityNum));
        }
        this.SocialSecurityNum = data.currentCaregiverSocialSecurityNum;
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          if (this.caregiverDetail.visits) {
            this.visitData = this.caregiverDetail.visits;
          } else {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadCaregiverVisits(this.SocialSecurityNum));
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
