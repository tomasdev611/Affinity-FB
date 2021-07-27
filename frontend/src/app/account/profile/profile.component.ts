import {Component, OnInit} from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../../services/db/user.service';
import {BusinessService} from '../../services/db/business.service';

import {Router} from '@angular/router';

import {placeholderChars, alphabetic, digit} from '../constants';
import {dashCaseToCamelCase} from '@angular/compiler/src/util';
import {Input} from '@angular/core/src/metadata/directives';
import {environment} from '../../../environments/environment';
import {UtilsService} from '../../services/db/utils.service';

const defaultValues = {
  placeholderChar: placeholderChars.whitespace,
  guide: true,
  pipe: null,
  keepCharPositions: false,
  help: null,
  placeholder: null
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
    `
      .red {
        color: red;
      }
    `
  ]
})

/**
 *
 */
export class ProfileComponent implements OnInit {
  /**
   *
   */
  choices: (
    | {name: string; mask: boolean; value: string; placeholder: string}
    | {name: string; mask: (string | RegExp)[]; value: string; placeholder: string}
    | {name: string; mask: boolean; value: string; placeholder: string})[];
  profile = {
    CompanyName: '',
    franchiseID: '',
    TIN: '',
    Address: '',
    City: '',
    State: '',
    Zip: '',
    Phone: '',
    ProviderNumber: ''
  };
  myModel: string;
  modelWithValue: string;
  formControlInput: FormControl = new FormControl();
  mask: Array<string | RegExp>;
  franchiseID: string;
  AgencyID: String = '';
  logo: any;
  PayPeriodEndDay: number;
  bit_CmpNameOnReports: boolean = false;

  ComapanyName: String = '';
  FranchiseID: String = '';
  Address: String = '';
  City: String = '';
  State: String = '';
  DivisionID: String = '';

  comp_error = false;
  tax_error = false;
  addrs_error = false;
  city_error = false;
  state_error = false;
  zip_error = false;
  phone_error = false;
  p_no_error = false;
  f_id_error = false;
  d_id_error = false;
  //to show alert on successfull update
  dataupdatedAlert = true;

  //Feb-9
  img_error: boolean = false;
  img_error1: boolean = false;
  img_url: string = '';
  img_url_status: boolean = false;
  filesToUpload: Array<File>;

  selectProfilePic: boolean;
  img_loader: boolean;
  img_text: string;
  description: any;
  //to show alert on successfull update
  attUploadAlert = true;

  logo_url: String = '';
  new_logo: String = 'test';

  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};
  checkAccess() {
    const acl_list = JSON.parse(localStorage.getItem('acl_list'));
    //  console.log(acl_list);
    for (var i = 0; i < acl_list.length; i++) {
      var name = acl_list[i].GroupId;
      if (name == this.access_group_id) {
        this.acl_allow.read = acl_list[i].bit_read;
        this.acl_allow.update = acl_list[i].bit_update;
        this.acl_allow.delete = acl_list[i].bit_delete;
      }
    }
  }

  /**
   *
   * @param businessService
   * @param router
   */
  constructor(
    public businessService: BusinessService,
    public router: Router,
    private utilsService: UtilsService
  ) {
    if (this.check_access_on_init) {
      this.checkAccess();
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }

    this.mask = [];

    this.myModel = '';
    this.modelWithValue = '';
    this.formControlInput.setValue('');
    this.fetchProfile();
  }

  /**
   *    for fetch profile data from server
   */
  fetchProfile() {
    var auth_token = localStorage.getItem('auth_token');
    this.businessService.get(auth_token).subscribe(data => {
      this.profile.CompanyName = data.CompanyName;
      this.profile.TIN = data.TIN;
      this.profile.Address = data.Address;
      this.profile.City = data.City;
      this.profile.State = data.State;
      this.profile.Zip = data.Zip;
      this.profile.Phone = data.Phone;
      this.profile.ProviderNumber = data.providerNum;
      this.profile.franchiseID = data.FranchiseID;
      this.AgencyID = data.AgencyID;
      this.ComapanyName = data.CompanyName;
      this.FranchiseID = data.FranchiseID;
      this.Address = data.Address;
      this.City = data.City;
      this.State = data.State;
      this.logo_url = environment.aws + data.logo_url;

      //alert(this.logo_url);

      this.logo = data.logo;
      this.PayPeriodEndDay = data.PayPeriodEndDay;
      this.bit_CmpNameOnReports = data.bit_CmpNameOnReports;

      this.makeForm();
    });
  }

  /**
    for create dynamic contents
   */
  makeForm() {
    this.choices = [
      {
        name: 'Tax ID',
        mask: [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
        value: this.profile.TIN,
        placeholder: 'xx-xxxxxx'
      },
      {
        name: 'US phone number',
        mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        value: this.profile.Phone,
        placeholder: '(xxx) xxx-xxxx'
      },
      {
        name: 'Provider Number',
        mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        value: this.profile.ProviderNumber,
        placeholder: '(xxx) xxx-xxxx'
      },
      {
        name: 'Zip',
        mask: [/[1-9]/, /\d/, /\d/, /\d/, /\d/],
        value: this.profile.Zip,
        placeholder: 'xxxxx'
      }
    ];
  }

  /**
   *
   */
  ngOnInit() {}

  // for update the company information send to server

  submitForm() {
    // console.log(this.choices[0].value);
    var param = {
      CompanyName: this.ComapanyName,
      TIN: this.choices[0].value,
      Address: this.Address,
      City: this.City,
      State: this.State,
      Zip: this.choices[3].value,
      Phone: this.choices[1].value,
      providerNum: this.choices[2].value,
      FranchiseID: this.FranchiseID,
      AgencyID: this.AgencyID,
      PayPeriodEndDay: this.PayPeriodEndDay,
      bit_CmpNameOnReports: this.bit_CmpNameOnReports,
      logo_url: this.new_logo
    };
    this.businessService.post(param).subscribe(data => {
      this.dataupdatedAlert = false;
      setTimeout(() => (this.dataupdatedAlert = true), 5000);
    });
  }

  // for validation on address , city , state , Division ID , FranchiseID

  keyupaddess(event) {
    if (event.target.value.trim()) {
      this.addrs_error = false;
    } else {
      this.addrs_error = true;
    }
  }

  keyupCity(event) {
    if (event.target.value.trim()) {
      this.city_error = false;
    } else {
      this.city_error = true;
    }
  }

  keyupState(event) {
    if (event.target.value.trim()) {
      this.state_error = false;
    } else {
      this.state_error = true;
    }
  }

  keyupDID(event) {
    if (event.target.value.trim()) {
      this.d_id_error = false;
    } else {
      this.d_id_error = true;
    }
  }
  keyupFID(event) {
    if (event.target.value.trim()) {
      this.f_id_error = false;
    } else {
      this.f_id_error = true;
    }
  }

  //    validation for only accept characters
  alphaOnly(event) {
    var key = event.keyCode;
    return (key >= 65 && key <= 90) || key == 8 || (key >= 97 && key <= 122);
  }

  //rendering the image on web page
  readUrl(event: any) {
    this.img_error = false;
    this.selectProfilePic = true;
    this.filesToUpload = <Array<File>>event.target.files;
    //console.log(event);
    if (event.target.files) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        //console.log(event.target.result);
        this.img_url = event.target.result;
        this.img_url_status = true;
        // if (this.addNewUser_add) {
        //   this.upload_click = false;
        // }
        this.upload();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  //   for upload image
  upload() {
    this.img_error1 = false;
    // if (this.addNewUser_add) {
    //   this.upload_click = true;
    // }
    this.img_loader = true;
    this.makeFileRequest(
      environment.server + '/api/v1/storage/upload/',
      [],
      this.filesToUpload[0]
    ).then(
      result => {
        //console.log(environment.server + "/api/v1/storage/upload/");
        this.img_loader = false;
        this.attUploadAlert = false;

        this.logo_url = environment.aws + this.img_text;
        setTimeout(() => (this.attUploadAlert = true), 5000);
      },
      error => {
        console.error(error);
      }
    );
  }
  makeFileRequest(url: string, params: Array<string>, files: File) {
    var extension = files.name.substr(files.name.length - 4);
    this.img_text = new Date().getTime() + localStorage.getItem('id') + extension;
    this.new_logo = this.img_text;
    return this.utilsService.makeFileRequest(this.img_text, url, params, files);
  }
}
