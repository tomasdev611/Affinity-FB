import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {DataService} from '../../services/db/data.service';
import {Location} from '@angular/common';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {LoadSingleClient, SetCurrentClientID} from '../../states/actions/client.actions';
import {AuthService} from '../../services/gaurd/auth.service';
import * as fromRoot from '../../states/reducers';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CACHE_ENABLED} from '../../config';

@Component({
  selector: 'app-client-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  clientDetail: any;
  ClientId: string;
  //var to show add client button : Varun
  isNewClient: boolean;
  ClientName: string = '';
  check_access_on_init = true;
  access_group_id = 'Client Data';
  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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
    this.activatedRoute.params.subscribe((params: Params) => {
      let Id = params['id'];
      if (Id !== ' ' && Id > 0) {
        if (!CACHE_ENABLED && this.ClientId !== Id) {
          this.store.dispatch(new LoadSingleClient(Id));
        }
        this.ClientId = Id;
      }
      this.store.dispatch(new SetCurrentClientID(Id));
      this.isNewClient = !this.ClientId;
    });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          if (!this.clientDetail.personaldata) {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadSingleClient(this.ClientId));
            }
          } else {
            let link = '/client/details/' + this.ClientId;
            let title = `${this.clientDetail.personaldata.LastName}, ${
              this.clientDetail.personaldata.FirstName
            }`;
            this.ClientName = `${this.clientDetail.personaldata.FirstName} ${
              this.clientDetail.personaldata.LastName
            }`;
            this.authService.checkAndAddLink({
              link,
              linkName: 'Client',
              title,
              type: 'client',
              canClose: true
            });
          }
        }
      });
  }

  // code for click event on calendar tabs and check Reason then navigate to calendar page
  gotoCalendar() {
    this.router.navigate([
      '/schedule/calendar',
      {userID: this.ClientId, username: this.ClientName}
    ]);
  }

  // for closing the modal when move another component
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
