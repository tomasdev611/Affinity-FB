import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {omit, cloneDeep} from 'lodash';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import * as querystring from 'querystring';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/gaurd/auth.service';
import {CLIENT_DEFAULT} from '../../../common/default';
import {getAgeFromBirthday} from '../../../utils/helpers';
import * as fromRoot from '../../../states/reducers';
import {
  UpdateSingleClient,
  CreateSingleClient,
  UpdateClientCustomFieldsAll
} from '../../../states/actions/client.actions';

const DEFAULT_INITIAL_CONTACT = {
  Name: '',
  Address1: '',
  Address2: '',
  City: '',
  State: '',
  Zip: '',
  Relation: 0,

  Email: '',
  Phone: ''
};

@Component({
  selector: 'client-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  clientDetail: any;
  saving: string = '';

  ambulatory = [{name: 'Yes'}, {name: 'No'}];
  status = [{name: 'Active', value: 'A'}, {name: 'Inactive', value: 'I'}];

  selected: any = {
    ...CLIENT_DEFAULT
  };

  billingAddressSame = true;

  selectedPayor: any = {};
  originalCustomFields: any;
  originalPersonalData: any;
  customFieldsEdit: any = {};

  initialContact = {
    ...DEFAULT_INITIAL_CONTACT
  };

  priorityOptions = ['1', '2', '3', '4', '5', '6'];
  feedbackOptions = ['A', 'B', 'C', 'U', 'F'];

  initialContactTemp: any;

  ClientId: string;

  initialContacts = [];

  relations: any;
  referredBy = []; // // for store Referred By drop down array in personal data
  physicians = [];
  counties = [];
  payors = [];
  clientTypes = [];
  locationData = [];
  caseManagers = [];
  reasonData = []; //  for client reasonData

  //to manage the masking on SSN
  SSN_TYPE: String = 'password';
  mapUrl: any;

  //var to show add client button : Varun
  isNewClient: boolean = true;

  check_access_on_init = true;
  access_group_id = 'Client Data';

  acl_allow = {read: false, update: false, delete: false};
  allow_to_see_ssn: boolean = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private store: Store<any>,
    private notifierService: NotifierService
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      this.allow_to_see_ssn = this.acl_allow.read && this.acl_allow.update;
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientSaving)
      )
      .subscribe(data => {
        if (this.saving === 'saving' && data === 'success') {
          if (this.isNewClient) {
            this.router.navigate(['/client/list']);
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
          this.reasonData = data.reasons.filter(reason => reason.bit_client === true);
          if (this.isNewClient) {
            this.selected.str_reason = this.reasonData[0].str_reason;
          }

          this.initialContacts = data.initialContacts;
          this.caseManagers = data.caseManagers;
          this.relations = data.relations;
          this.locationData = data.locationData;
          this.referredBy = data.referredBy;
          this.physicians = data.physicians;
          this.clientTypes = data.clientTypes;
          this.payors = data.payors;

          if (this.isNewClient) {
            this.selected.clientTypeID = this.clientTypes[0].clientTypeID;
          }

          this.counties = data.counties;
          if (this.isNewClient) {
            this.selected.County = this.counties[0].county;
          }
          this.changeSelectedPayor();
        }
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        if (this.ClientId !== data.currentClientId) {
          this.clientDetail = null;
          this.customFieldsEdit = {};
          this.selected = {};
        }
        this.ClientId = data.currentClientId;
        this.isNewClient = this.ClientId === '0';
        this.clientDetail = data[this.ClientId];
        if (this.isNewClient) {
          if (Object.keys(this.selected).length === 0) {
            this.selected = {
              ...CLIENT_DEFAULT
            };
          }
        } else {
          if (
            this.clientDetail &&
            this.clientDetail.personaldata &&
            this.originalPersonalData !== this.clientDetail.personaldata
          ) {
            this.selected = cloneDeep(this.clientDetail.personaldata);
            this.mapUrl = this.mapUrlGenerator(this.clientDetail.personaldata);
            this.changeSelectedPayor();
            // if (this.selected.PayorId) {
            this.billingAddressSame = !this.selected.PayorId;
            // }
          }
          if (
            this.clientDetail &&
            this.clientDetail.customfields &&
            this.originalCustomFields !== this.clientDetail.customfields
          ) {
            this.originalCustomFields = this.clientDetail.customfields;
            this.customFieldsEdit = this.clientDetail.customfields.reduce((obj, cur) => {
              obj[cur.cfieldName] = cur.descr;
              return obj;
            }, {});
          }
        }
      });
  }

  mapUrlGenerator(personaldata) {
    if (personaldata && personaldata.Address1 && personaldata.City) {
      const address = `${personaldata.Address1},${personaldata.City},${personaldata.State} ${
        personaldata.Zip
      }`;
      let q = querystring.stringify({q: address});
      let url: any = `https://maps.google.com/maps?${q}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
      url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      return url;
    }
    return null;
  }

  onBillingAddressSameChange() {
    if (this.billingAddressSame) {
      this.selected.PayorId = null;
      this.changeSelectedPayor();
    }
  }

  changeSelectedPayor() {
    if (this.selected.PayorId) {
      const PayorId = parseInt(this.selected.PayorId);
      const payor = this.payors.find(p => p.PayorId === PayorId) || {};
      this.selectedPayor = payor;
    } else {
      this.selectedPayor = {};
    }
  }

  checkFeedbackChanged() {
    if (this.clientDetail.customfields.length !== Object.keys(this.customFieldsEdit).length) {
      return true;
    }
    const differentField = this.clientDetail.customfields.find(cur => {
      return this.customFieldsEdit[cur.cfieldName] !== cur.descr;
    });
    return !!differentField;
  }

  maskPassword(event) {
    if (event.target.checked) this.SSN_TYPE = 'password';
    else this.SSN_TYPE = 'text';
  }

  prepareDataForPost(postData) {
    [
      'ReferredBy',
      'CaseManagerId',
      'InitialContactID',
      'clientTypeID',
      'Physician',
      'locationID',
      'PayorId'
    ].forEach(field => {
      if (!postData[field]) {
        postData[field] = null;
      }
    });

    [
      'ReferredBy',
      'CaseManagerId',
      'InitialContactID',
      'clientTypeID',
      'Physician',
      'locationID',
      'PayorId',
      'Weight',
      'int_statusid',
      'gstExempt'
    ].forEach(field => {
      if (postData[field]) {
        postData[field] = parseInt(postData[field]);
      }
    });
  }

  // update personal details data
  updateDetails() {
    let postData = omit(this.selected, [
      'ClientId',
      'created',
      'createdBy',
      'updatedBy',
      'lastUpdated'
    ]);
    if (postData.initialContact) {
      if (postData.initialContact.InitialContactID) {
        // This means initialContact not updated.
        // When initial contact updated, we are removing initial contact id
        postData = omit(postData, 'initialContact');
      }
    }
    this.prepareDataForPost(postData);
    this.store.dispatch(
      new UpdateSingleClient({
        ClientId: this.ClientId,
        data: postData
      })
    );
    if (this.checkFeedbackChanged()) {
      const customfields = Object.keys(this.customFieldsEdit).map(cfieldName => ({
        cfieldName,
        descr: this.customFieldsEdit[cfieldName]
      }));
      this.store.dispatch(
        new UpdateClientCustomFieldsAll({
          ClientId: this.ClientId,
          data: {customfields}
        })
      );
      // this.store.dispatch(
      //   new UpdateClientCustomFieldsAll({
      //     ClientId: this.ClientId,
      //     data: {cfieldName: 'Feedback', descr: this.selected.feedback}
      //   })
      // );
    }
  }

  getBirthday() {
    if (this.selected.DateOfBirth) {
      return getAgeFromBirthday(this.selected.DateOfBirth);
    }
    return '';
  }

  inactivateClient() {
    this.store.dispatch(new UpdateSingleClient({ClientId: this.ClientId, data: {Status: 'I'}}));
  }

  activateClient() {
    this.store.dispatch(new UpdateSingleClient({ClientId: this.ClientId, data: {Status: 'A'}}));
  }

  newInitialContactAction(content) {
    this.initialContact = omit(this.selected.initialContact || DEFAULT_INITIAL_CONTACT, [
      'InitialContactID',
      'created',
      'createdBy',
      'updatedBy',
      'lastUpdated'
    ]);
    content.show();
  }

  /**
   *
   */
  submitInitialContact(content) {
    // let postData = {
    //   x_Name: this.x_icName,
    //   x_Relation: this.x_icRelation,
    //   x_Email: this.x_icEmail,
    //   x_Phone: this.x_icPhone,
    //   ClientId: this.ClientId,
    //   Name: this.icName,
    //   Address1: this.icAddress1,
    //   Address2: this.icAddress2,
    //   City: this.icCity,
    //   State: this.icState,
    //   Zip: this.icZip,
    //   Relation: this.icRelation,
    //   Email: this.icEmail,
    //   Phone: this.icPhone
    // };
    if (!this.initialContact.Name) {
      this.notifierService.notify('error', 'Name is required');

      return;
    }
    this.selected.initialContact = cloneDeep(this.initialContact);
    content.hide();
  }

  // for Add new client personal Details
  addNewClient() {
    var postData = {
      ...this.selected,
      RefNumber: 1
    };

    this.prepareDataForPost(postData);
    this.store.dispatch(
      new CreateSingleClient({
        data: postData
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
