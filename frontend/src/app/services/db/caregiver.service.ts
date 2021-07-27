import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {stringify} from 'querystring';
// import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment';

@Injectable()
export class CaregiverService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  getAllCaregiverWithCustomFields(query = {}) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/withcustomfields?${stringify(query)}`)
      .pipe(map((res: any) => res));
  }

  searchCaregivers(data) {
    return this.http
      .post(environment.server + '/api/v1/caregiver/search', data)
      .pipe(map((res: any) => res));
  }

  searchCaregiversPage(data) {
    return this.http
      .post(environment.server + '/api/v1/caregiver/search/data', data)
      .pipe(map((res: any) => res));
  }

  postAddCaregiverData(data) {
    return this.http
      .post(environment.server + '/api/v1/caregiver', data)
      .pipe(map((res: any) => res));
  }

  updateCaregiverData(SocialSecurityNum, data) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/update_data`, data)
      .pipe(map((res: any) => res));
  }

  updateCaregiverPhoto(SocialSecurityNum, data) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/photo`, data)
      .pipe(map((res: any) => res));
  }

  getCaregiverInfo(SocialSecurityNum) {
    return this.http
      .get(environment.server + '/api/v1/caregiver/' + SocialSecurityNum + '/all')
      .pipe(map((res: any) => res));
  }

  getVisitHistory(SocialSecurityNum) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/visits`)
      .pipe(map((res: any) => res));
  }

  // Contacts Related API Calls
  getContactDetails(SocialSecurityNum) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/contacts`)
      .pipe(map((res: any) => res));
  }

  createContact(SocialSecurityNum, contact) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/contacts`, contact)
      .pipe(map((res: any) => res));
  }

  deleteContact(SocialSecurityNum, ContactID) {
    return this.http
      .delete(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/contacts/${ContactID}`)
      .pipe(map((res: any) => res));
  }

  updateContact(SocialSecurityNum, ContactID, contact) {
    return this.http
      .put(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/contacts/${ContactID}`,
        contact
      )
      .pipe(map((res: any) => res));
  }

  // Feb-13 Jatin
  getAllNotes(SocialSecurityNum) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/notes`)
      .pipe(map((res: any) => res));
  }

  createNote(SocialSecurityNum, note) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/notes`, note)
      .pipe(map((res: any) => res));
  }

  deleteNote(SocialSecurityNum, NoteDate, NoteTime) {
    return this.http
      .delete(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/notes/${NoteDate}/${NoteTime}`
      )
      .pipe(map((res: any) => res));
  }

  updateNote(SocialSecurityNum, NoteDate, NoteTime, note) {
    return this.http
      .put(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/notes/${NoteDate}/${NoteTime}`,
        note
      )
      .pipe(map((res: any) => res));
  }

  getCustomFields(SocialSecurityNum) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/customfields`)
      .pipe(map((res: any) => res));
  }

  updateCustomField(SocialSecurityNum, postData) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/customfields`, postData)
      .pipe(map((res: any) => res));
  }

  updateCustomFieldAll(SocialSecurityNum, postData) {
    return this.http
      .post(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/customfields/all`,
        postData
      )
      .pipe(map((res: any) => res));
  }

  updateSkills(SocialSecurityNum, postData) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/skills`, postData)
      .pipe(map((res: any) => res));
  }

  updateLanguages(SocialSecurityNum, postData) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/languages`, postData)
      .pipe(map((res: any) => res));
  }

  updateAvailabilities(SocialSecurityNum, postData) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/availabilities`, postData)
      .pipe(map((res: any) => res));
  }

  getReminders(SocialSecurityNum) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/reminders`)
      .pipe(map((res: any) => res));
  }

  // post the new reminder data on submit
  createReminder(SocialSecurityNum, reminder) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/reminders`, reminder)
      .pipe(map((res: any) => res));
  }
  // for delete reminder
  deleteReminder(SocialSecurityNum, ExpirationID) {
    return this.http
      .delete(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/reminders/${ExpirationID}`
      )
      .pipe(map((res: any) => res));
  }

  // post the new reminder data on submit
  updateReminder(SocialSecurityNum, ExpirationID, reminder) {
    return this.http
      .put(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/reminders/${ExpirationID}`,
        reminder
      )
      .pipe(map((res: any) => res));
  }

  getAttachmentData(SocialSecurityNum) {
    return this.http
      .get(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/attachments`)
      .pipe(map((res: any) => res));
  }

  // for send attachment on server
  createAttachment(SocialSecurityNum, attachment) {
    return this.http
      .post(`${environment.server}/api/v1/caregiver/${SocialSecurityNum}/attachments`, attachment)
      .pipe(map((res: any) => res));
  }

  // for update attachment on server
  updateAttachment(SocialSecurityNum, AttachmentId, attachment) {
    return this.http
      .put(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/attachments/${AttachmentId}`,
        attachment
      )
      .pipe(map((res: any) => res));
  }

  // for delete attachment
  deleteAattachment(SocialSecurityNum, AttachmentId) {
    return this.http
      .delete(
        `${environment.server}/api/v1/caregiver/${SocialSecurityNum}/attachments/${AttachmentId}`
      )
      .pipe(map((res: any) => res));
  }

  // for delete attachment
  downloadAttachment(SocialSecurityNum, AttachmentId) {
    return this.http
      .get(
        `${
          environment.server
        }/api/v1/caregiver/${SocialSecurityNum}/attachments/${AttachmentId}/download`
      )
      .pipe(map((res: any) => res));
  }

  fetchCaregiverReminders() {
    // get reminders data for caregivers
    let url = environment.server + '/api/v1/caregiver/reminder/all/all';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchAllCaregiver() {
    let url = environment.server + '/api/v1/caregiver';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchCaregiverWithSocialNo(SosicalSecNo_url) {
    //  fetch Personal data and addesss of caregiver
    let url = environment.server + '/api/v1/caregiver/' + SosicalSecNo_url + '/';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  // for visit
  fetchVisitors(SosicalSecNo_url) {
    // get visitors data for caregivers
    let url = environment.server + '/api/v1/caregiver/visits/' + SosicalSecNo_url + '/';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchAttachment(SosicalSecNo_url) {
    // get attachment data for caregivers
    let url = environment.server + '/api/v1/caregiver/attachment/' + SosicalSecNo_url + '/';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  getReminderDescription() {
    // get attachment data for caregivers
    let url = environment.server + '/api/v1/caregiver/reminderDescription';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchContacts(social_SecurityNum) {
    // get attachment data for caregivers
    let url = environment.server + '/api/v1/caregiver/contacts/' + social_SecurityNum + '/';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchReminders(SosicalSecNo_url) {
    // get Reminders data for caregivers
    let url = environment.server + '/api/v1/caregiver/reminder/' + SosicalSecNo_url + '/';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  // for get All Note Type
  getClassName() {
    let url = environment.server + '/api/v1/caregiver/get/classtype';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  // for get All Note Type
  getClassificatioID() {
    let url = environment.server + '/api/v1/caregiver/get/classificatioID';
    return this.http.get(url).pipe(map((res: any) => res));
  }

  //  for get all rows curresponding caregiver Id
  fetchCustomRows() {
    let url = environment.server + '/api/v1/caregiver/custom';
    return this.http.post(url, {}).pipe(map((res: any) => res));
  }

  fetchCaregiverTest(userStatus) {
    let url = environment.server + '/api/v1/caregiver/' + userStatus;
    return this.http.get(url).pipe(map((res: any) => res));
  }

  fetchCaregiverForHours(random, viewDate, view) {
    let url =
      environment.server +
      '/api/v1/caregiver/hours/caregiver/?_r=' +
      random +
      '&calendarTime=' +
      viewDate +
      '&type=' +
      view;
    return this.http.get(url).pipe(map((res: any) => res));
  }
}
