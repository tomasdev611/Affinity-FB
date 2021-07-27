import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject, Subscription} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from '../../services/gaurd/auth.service';
import {NotifierService} from 'angular-notifier';
import * as fromRoot from '../../states/reducers';
import {CreateSingleCaregiver} from '../../states/actions/caregiver.actions';
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import { RegistrationService } from '../../services/db/registration.service';

const DEFAULT_IMAGE = '/assets/images/unsplash/edit_profile.svg';
const CAREGIVER_DEFAULT = {
  SocialSecurityNum: '999999998',
  LastName: 'Shaffer',
  FirstName: 'Edda',
  MiddleInit: '',
  Address1: '10501 La Placida Dr North',
  Address2: '',
  City: 'Coral Springs',
  County: 'MIA',
  State: 'FL',
  Zip: '33065',
  ValidDriversLicense: false,
  Smoker: false,
  WeightRestriction: false,
  WeightLimit: 60, // Unused Field
  ClassificationID: '23',
  DateofBirth: '1990-01-01',
  Status: 'I',
  StatusDate: '', // This is Hire Date
  InactiveDate: '', // This is Term Date
  Email: 'test@test.test',
  // QuickbooksId: '', // Unused Field
  // CertExpirationDate: '', // Unused Field
  // Certification: '', // Unused Field
  // payOvertime: false, // Unused Field
  // CreateQbTSheets: false, // Unused Field
  Phone1: '123456789',
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
  str_reason: 'REGISTER',
  str_Gender: 'M',
  TextMessage: ''
};

@Component({
  selector: 'registration-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  selected: any = {
    ...CAREGIVER_DEFAULT
  };
  saving: string = '';

  counties = [];
  classifications = [];

  imageData: any = DEFAULT_IMAGE;

  check_access_on_init = true;
  access_group_id = 'Caregiver Registration';

  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _caregiverRegister: Subscription = undefined;
  posting: boolean = false;

  // webcam
  public errors: WebcamInitError[] = [];
  public trigger: Subject<void> = new Subject<void>();

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifierService: NotifierService,
    private store: Store<any>,
    private registrationService: RegistrationService
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/registration/page404']);
      }
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.counties = data.counties;
          this.classifications = data.classifications;
        }
      });
  }

  // Camera actions
  triggerSnapshot(): void {
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get imageTaken(): boolean {
    return this.imageData !== DEFAULT_IMAGE;
  }

  handleImage(webcamImage: WebcamImage): void {
    this.imageData = webcamImage.imageAsDataUrl;
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  prepareDataForPost(postData) {
    ['ClassificationID', 'className'].forEach(field => {
      if (!postData[field]) {
        delete postData[field]
      }
    });

    postData.NPI = postData.NPIOption.map(o => o.val).join('');
    if (postData.NPI === '-') {
      postData.NPI = '';
    }

    let newDateOfBirth = postData.DateofBirth + ' 00:00:00.000';
    postData.DateOfBirth = newDateOfBirth;
    delete postData.DateofBirth;

    delete postData.NPIOption;

    return postData;
  }

  // for Add new caregiver personal Details
  async addNewCaregiver() {
    if (this.selected['SocialSecurityNum'].length < 1) {
      this.notifierService.notify('error', 'SSN is required');
      return false;
    }

    var postData = {
      ...this.selected
    };
    postData = this.prepareDataForPost(postData);
    console.log(postData);

    var formData: FormData = new FormData();
    var extension = ".jpg";
    let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
    let filedata = await fetch(this.imageData).then(r => r.blob());
    formData.append('file', filedata, img_text);

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
    this._caregiverRegister = this.store.select('caregiver').subscribe(res => this.caregiverCreateResult(res))
    this.posting = true;
    this.saving = 'saving';
  }

  caregiverCreateResult(res) {
    if (res.saving !== 'saving') {
      if (res.saving === 'success') {
        this.registrationService.clear().subscribe(() => {
          this.registrationService.setSSN(this.selected['SocialSecurityNum']);
          this.router.navigate(['/registration/step2/']);
        }, () => {});
      } else if (res.saving === 'error') {
        this.notifierService.notify('error', 'Failed to register, please try again.');
      }
      this._caregiverRegister.unsubscribe();
      this.posting = false;
      this.saving = '';
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
