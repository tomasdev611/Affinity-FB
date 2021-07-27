import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {omit, cloneDeep} from 'lodash';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import * as querystring from 'querystring';
import {AuthService} from '../../../services/gaurd/auth.service';
import {CaregiverService} from '../../../services/db/caregiver.service';
import {MessageService} from '../../../services/db/message.service';
import {NotifierService} from 'angular-notifier';
import * as fromRoot from '../../../states/reducers';
import {getAgeFromBirthday, s3UrlFor} from '../../../utils/helpers';
import {
  UpdateSingleCaregiver,
  CreateSingleCaregiver,
  UpdateCaregiverCustomFields
} from '../../../states/actions/caregiver.actions';
import {SendMessage} from '../../../states/actions/message.actions';

const DEFAULT_IMAGE = '/assets/images/unsplash/edit_profile.svg';
const CAREGIVER_DEFAULT = {
  SocialSecurityNum: '',
  LastName: '',
  FirstName: '',
  MiddleInit: '',
  Address1: '',
  Address2: '',
  City: '',
  County: '',
  State: '',
  Zip: '',
  ValidDriversLicense: false,
  Smoker: false,
  WeightRestriction: false,
  WeightLimit: 60, // Unused Field
  ClassificationID: '',
  DateofBirth: '',
  Status: 'I',
  StatusDate: '', // This is Hire Date
  InactiveDate: '', // This is Term Date
  Email: '',
  // QuickbooksId: '', // Unused Field
  // CertExpirationDate: '', // Unused Field
  // Certification: '', // Unused Field
  // payOvertime: false, // Unused Field
  // CreateQbTSheets: false, // Unused Field
  Phone1: '',
  Phone2: '',
  BackgroundCheck: false,
  className: '',
  // notes: '', // Unused Field
  independentContractor: false,
  // telephonyID: '', // Unused Field
  doNotRehire: false,
  // paychexID: '', // Unused field
  NPI: '',
  NPIOption: ['1', '-', '1', '1', '1'].map(val => ({val})), // This is Not DB field, this is auto-generated and will generate NPI
  str_reason: '',
  str_Gender: 'M',
  TextMessage: ''
};

@Component({
  selector: 'caregiver-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  caregiverDetail: any;
  saving: string = '';

  Gender: any = ['M', 'F'];
  ambulatory = [{name: 'Yes'}, {name: 'No'}];
  status = [{name: 'Active', value: 'A'}, {name: 'Inactive', value: 'I'}];
  npiOptions = ['', '1', '2', '3', '4', '5'];
  selected: any = {
    ...CAREGIVER_DEFAULT
  };

  SocialSecurityNum: string;
  filesToUpload: Array<File>;

  showChatbox = false;
  chatboxOptions = {};
  counties = [];
  classesNames = [];
  caregiverNoteTypes = [];
  classifications = [];
  reasonData = []; //  for caregiver reasonData
  mapUrl: any;

  imageData: any = DEFAULT_IMAGE;

  //var to show add caregiver button : Varun
  isNewCaregiver: boolean = true;

  socialSecurityNumberChanged = false;
  newSocialSecurityNumber: string = '';

  sendMessageFrom: any;
  sendMsgSub: any;
  sendMsgDesrc: any;

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';

  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private caregiverService: CaregiverService,
    private authService: AuthService,
    private notifierService: NotifierService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private store: Store<any>
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverSaving)
      )
      .subscribe(data => {
        if (this.saving === 'saving' && data === 'success') {
          if (this.isNewCaregiver) {
            // this.router.navigate(['/caregiver/list']);
          }
          if (this.socialSecurityNumberChanged) {
            let newNumber = this.newSocialSecurityNumber;
            setTimeout(() => {
              this.router.navigate([`/caregiver/details/${newNumber}`]);
            }, 200);
            this.socialSecurityNumberChanged = false;
            this.newSocialSecurityNumber = '';
            this.filesToUpload = null;
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

        console.log('here', data)
        if (data.loaded) {
          this.reasonData = data.reasons.filter(reason => reason.bit_caregiver === true);
          if (this.isNewCaregiver) {
            this.selected.str_reason = this.reasonData[0].str_reason;
          }

          this.classifications = data.classifications;
          this.caregiverNoteTypes = data.caregiverNoteTypes;
          this.classesNames = data.classesNames;
          this.counties = data.counties;
          if (this.isNewCaregiver) {
            this.selected.County = this.counties[0].county;
          }
        }
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverDetailMap)
      )
      .subscribe(data => {
        if (this.SocialSecurityNum !== data.currentCaregiverSocialSecurityNum) {
          this.caregiverDetail = null;
          this.imageData = DEFAULT_IMAGE;
          this.selected = {};
        }
        this.SocialSecurityNum = data.currentCaregiverSocialSecurityNum;
        this.isNewCaregiver = this.SocialSecurityNum === '0';
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.isNewCaregiver) {
          if (Object.keys(this.selected).length === 0) {
            this.selected = cloneDeep(CAREGIVER_DEFAULT);
          }
        } else {
          if (this.caregiverDetail && this.caregiverDetail.personaldata) {
            this.selected = {
              ...cloneDeep(CAREGIVER_DEFAULT),
              ...cloneDeep(this.caregiverDetail.personaldata),
              NPIOption: this.generateNPIOption(this.caregiverDetail.personaldata.NPI),
              feedback: this.getFeedbackField()
            };
            this.mapUrl = this.mapUrlGenerator(this.caregiverDetail.personaldata);
            if (this.imageData === DEFAULT_IMAGE && this.caregiverDetail.personaldata.photo) {
              this.imageData = s3UrlFor(this.caregiverDetail.personaldata.photo);
            }
          }
        }
      });
  }

  getFeedbackField() {
    let feedbackCustomField = this.caregiverDetail.customfields.find(
      c => c.cfieldName === 'Feedback'
    );
    if (feedbackCustomField) {
      return feedbackCustomField.descr;
    }
    return '';
  }

  generateNPIOption(npi = '') {
    let splitted = npi.split('');
    let npOptions = [];
    for (let i = 0; i < 5; i++) {
      if (i === 1) {
        npOptions.push('-');
      } else {
        if (splitted.length > i) {
          let t = splitted[i];
          if ('12345'.includes(t)) {
            npOptions.push(t);
          } else {
            npOptions.push('');
          }
        } else {
          npOptions.push('');
        }
      }
    }
    return npOptions.map(val => ({val}));
  }

  onStatusReasonChange(content) {
    if (this.selected.Status === 'I' && this.selected.str_reason === 'TERMINATED') {
      setTimeout(() => {
        content.show();
      }, 100);
    }
  }

  prepareDataForPost(postData) {
    /* ValidationError: ValidDriversLicense: should be boolean,
    Smoker: should be boolean, WeightRestriction: should be boolean, WeightLimit: should be integer,null,
    ClassificationID: should be integer,null, payOvertime: should be boolean, CreateQbTSheets: should be boolean,
    BackgroundCheck: should be boolean, independentContractor: should be boolean, doNotRehire: should be boolean,
    int_statusid: should be integer,null, MessageID: should be integer,null
    */
    ['ClassificationID', 'className'].forEach(field => {
      if (!postData[field]) {
        // postData[field] = null;
        delete postData[field]
      }
    });
    postData.NPI = postData.NPIOption.map(o => o.val).join('');
    if (postData.NPI === '-') {
      postData.NPI = '';
    }
    delete postData.NPIOption;

    // if (postData.feedback === this.getFeedbackField()) {
    delete postData.feedback;
    // }
    [
      'ReferredBy',
      'CaseManagerId',
      'InitialContactID',
      'caregiverTypeID',
      'Physician',
      'locationID',
      'PayorId',
      'Weight',
      'int_statusid',
      'gstExempt'
    ].forEach(field => {
      if (postData[field]) {
        postData[field] = parseInt(postData[field]);
      } else {
        delete postData[field];
      }
    });

    return postData;
  }

  inactivateCaregiver() {
    this.store.dispatch(
      new UpdateSingleCaregiver({SocialSecurityNum: this.SocialSecurityNum, data: {Status: 'I'}})
    );
  }

  activateCaregiver() {
    this.store.dispatch(
      new UpdateSingleCaregiver({SocialSecurityNum: this.SocialSecurityNum, data: {Status: 'A'}})
    );
  }
  // for Add new caregiver personal Details
  async addNewCaregiver() {
    if (this.selected['SocialSecurityNum'].length < 1) {
      alert('SSN is required !');
      return false;
    }

    var postData = {
      ...this.selected
    };
    postData = this.prepareDataForPost(postData);
    if (postData.NPI.length > 0 && postData.NPI.length < 5) {
      this.notifierService.notify('error', 'Please select attachment');
      return;
    }

    var formData: any = new FormData();
    if (this.filesToUpload && this.filesToUpload.length > 0) {
      let file = this.filesToUpload[0];
      var extension = file.name.substr(file.name.length - 4);
      let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
      formData.append('file', file, img_text);
      // this.filesToUpload = null;
    }

    Object.keys(postData).forEach(c => {
      if (postData.hasOwnProperty(c)) {
        formData.append(c, postData[c]);
      }
    });
    this.store.dispatch(
      new CreateSingleCaregiver({
        data: formData
      })
    );
    // if (this.selected.feedback) {
    //   this.store.dispatch(
    //     new UpdateCaregiverCustomFields({
    //       SocialSecurityNum: this.SocialSecurityNum,
    //       data: {cfieldName: 'Feedback', descr: this.selected.feedback}
    //     })
    //   );
    // }
    // if (this.filesToUpload && this.filesToUpload.length > 0) {
    //   await this.uploadProfile(this.selected['SocialSecurityNum']);
    //   this.filesToUpload = null;
    // }
  }

  //rendering the image on web page
  readProfileUrl(event: any) {
    //this.selected.profile_url="";
    this.filesToUpload = <Array<File>>event.target.files;
    // this.uploadProfile();
    if (event.target.files) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageData = event.target.result;
        // this.uploadProfile();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  deletePicture() {
    this.imageData = DEFAULT_IMAGE;
    this.filesToUpload = null;
  }

  //   for upload image  in attachment
  uploadProfile(SocialSecurityNum) {
    let file = this.filesToUpload[0];
    var extension = file.name.substr(file.name.length - 4);
    let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
    var formData: any = new FormData();
    formData.append('file', file, img_text);
    return new Promise((resolve, reject) => {
      this.caregiverService.updateCaregiverPhoto(SocialSecurityNum, formData).subscribe(
        data => {
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  }

  // update personal details data
  async updateDetails() {
    let postData = omit(this.selected, [
      'SocialSecurityNum',
      'imageData',
      'created',
      'createdBy',
      'updatedBy',
      'lastUpdated'
    ]);

    const newSocialSecurityNum = this.selected.SocialSecurityNum.split(' ').join();
    if (this.SocialSecurityNum !== newSocialSecurityNum) {
      // Social Security Number Changed
      if (newSocialSecurityNum.length !== 9) {
        this.notifierService.notify('error', 'Invalid Social security number');
        return;
      }
      postData.SocialSecurityNum = newSocialSecurityNum;
      this.socialSecurityNumberChanged = true;
      this.newSocialSecurityNumber = newSocialSecurityNum;
    }
    postData = this.prepareDataForPost(postData);
    if (postData.NPI.length > 0 && postData.NPI.length < 5) {
      this.notifierService.notify('error', 'Invalid NPI Option selected');
      return;
    }

    if (this.imageData === DEFAULT_IMAGE) {
      postData.imageDeleted = true;
      postData.photo = '';
    }

    var formData: any = new FormData();
    if (this.filesToUpload && this.filesToUpload.length > 0) {
      let file = this.filesToUpload[0];
      var extension = file.name.substr(file.name.length - 4);
      let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
      formData.append('file', file, img_text);
      // this.filesToUpload = null;
    }

    Object.keys(postData).forEach(c => {
      if (postData.hasOwnProperty(c)) {
        formData.append(c, postData[c]);
      }
    });

    this.store.dispatch(
      new UpdateSingleCaregiver({
        SocialSecurityNum: this.SocialSecurityNum,
        data: formData
      })
    );
    if (!this.socialSecurityNumberChanged) {
      if (this.selected.feedback !== this.getFeedbackField()) {
        this.store.dispatch(
          new UpdateCaregiverCustomFields({
            SocialSecurityNum: this.SocialSecurityNum,
            data: {cfieldName: 'Feedback', descr: this.selected.feedback}
          })
        );
      }
      // if (this.filesToUpload && this.filesToUpload.length > 0) {
      //   await this.uploadProfile(this.SocialSecurityNum);
      //   this.filesToUpload = null;
      // }
    }
  }

  generateImageSrc(byte) {
    var blob = new Blob([byte], {type: 'img/jpg'});
    return window.URL.createObjectURL(blob);
  }

  // // for attachments
  // open model for send message
  sendMessageAction() {
    const chatboxOptions = {
      caregiver: {...this.selected},
      RoomId: `${localStorage.getItem('username')}-${this.selected.SocialSecurityNum}`
    };
    this.messageService.addNewInstance(chatboxOptions);
  }

  getBirthday() {
    if (this.selected.DateofBirth) {
      return getAgeFromBirthday(this.selected.DateofBirth);
    }
    return '';
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

  // method for sending message to caregiver
  sendMessage() {
    this.store.dispatch(
      new SendMessage({
        target: {Phone: this.selected.Phone1, SocialSecurityNum: this.selected.SocialSecurityNum},
        message: this.sendMsgDesrc
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
