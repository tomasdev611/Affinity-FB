import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";


import { environment } from '../../../environments/environment';

@Injectable()
export class DataService {

  /**
   *
   * @param http
   */
  clientID = '';
  Name = "";
  selectedInDataService = {
    FirstName: "",
    MiddleInit: "",
    LastName: "",
    Phone: "",
    DateOfBirth: "",
    Weight: undefined,
    Status: "",
    Gender: "",
    ServiceStartDate: "",
    ServiceEndDate: "",
    Email: "",
    CaseManagerId: "",
    Ambulatory: "",
    ReferredBy: "",
    ReferralNumber: "",
    Physician: "",
    clientTypeID: "",
    ssn: "",
    telephonyID: "",
    AccountingID: "",
    Priority: "",
    Diagnosis: "",
    createdBy: localStorage.getItem('username'),
    updatedBy: localStorage.getItem('username'),
    profile_url: "",
    locationID: "",
    Address1: "",
    Address2: "",
    City: "",
    Zip: "",
    State: "",
    County: "",
    str_reason: ""


  };
  securityuserInDataService = {

    securityUsername: ""
  };

  caregiverDataService = { Status: "" };
  clientDataService = {};
  addClient: boolean = false;
  addCaregiver: boolean = false;
  constructor(public http: HttpClient) {
    //console.log("Data service called.");
  }
  getFirstname() {
    return this.selectedInDataService;
  }
}


