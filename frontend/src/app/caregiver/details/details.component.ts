import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {
  LoadSingleCaregiver,
  SetCurrentCaregiverSocialSecurityNum
} from '../../states/actions/caregiver.actions';
import {AuthService} from '../../services/gaurd/auth.service';
import * as fromRoot from '../../states/reducers';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CACHE_ENABLED} from '../../config';

@Component({
  selector: 'app-caregiver-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  caregiverDetail: any;
  SocialSecurityNum: string;

  //var to show add caregiver button : Varun
  isNewCaregiver: boolean;
  CaregiverName: string = '';

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';
  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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
    this.activatedRoute.params.subscribe((params: Params) => {
      let Id = params['id'];
      if (Id !== ' ' && Id > 0) {
        if (!CACHE_ENABLED && this.SocialSecurityNum !== Id) {
          this.store.dispatch(new LoadSingleCaregiver(Id));
        }
        this.SocialSecurityNum = Id;
      }
      this.store.dispatch(new SetCurrentCaregiverSocialSecurityNum(Id));
      this.isNewCaregiver = !this.SocialSecurityNum;
    });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverDetailMap)
      )
      .subscribe(data => {
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          if (!this.caregiverDetail.personaldata) {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadSingleCaregiver(this.SocialSecurityNum));
            }
          } else {
            let link = '/caregiver/details/' + this.SocialSecurityNum;
            let title = `${this.caregiverDetail.personaldata.LastName}, ${
              this.caregiverDetail.personaldata.FirstName
            }`;
            this.CaregiverName = `${this.caregiverDetail.personaldata.FirstName} ${
              this.caregiverDetail.personaldata.LastName
            }`;
            this.authService.checkAndAddLink({
              link,
              linkName: 'Caregiver',
              type: 'caregiver',
              canClose: true,
              title
            });
          }
        }
      });
  }

  // code for click event on calendar tabs and check Reason then navigate to calendar page
  gotoCalendar() {
    this.router.navigate([
      '/schedule/calendar',
      {ssn: this.SocialSecurityNum, caregivername: this.CaregiverName}
    ]);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
