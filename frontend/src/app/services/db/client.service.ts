import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {stringify} from 'querystring';

import {environment} from '../../../environments/environment';

@Injectable()
export class ClientService {
  /**
   *
   * @param http
   * @param router
   */
  constructor(private http: HttpClient, private router: Router) {}

  getAllClientWithCustomFields(query = {}) {
    return this.http
      .get(`${environment.server}/api/v1/client/withcustomfields?${stringify(query)}`)
      .pipe(map((res: any) => res));
  }

  postAddClientData(data) {
    return this.http.post(environment.server + '/api/v1/client', data).pipe(map((res: any) => res));
  }

  updateClientData(ClientId, data) {
    return this.http
      .put(`${environment.server}/api/v1/client/${ClientId}`, data)
      .pipe(map((res: any) => res));
  }

  getClientInfo(ClientId) {
    return this.http
      .get(environment.server + '/api/v1/client/' + ClientId + '/all')
      .pipe(map((res: any) => res));
  }

  getVisitHistory(ClientId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/visits`)
      .pipe(map((res: any) => res));
  }

  // Contacts Related API Calls
  getContactDetails(ClientId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/contacts`)
      .pipe(map((res: any) => res));
  }

  createContact(ClientId, contact) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/contacts`, contact)
      .pipe(map((res: any) => res));
  }

  deleteContact(ClientId, ContactID) {
    return this.http
      .delete(`${environment.server}/api/v1/client/${ClientId}/contacts/${ContactID}`)
      .pipe(map((res: any) => res));
  }

  updateContact(ClientId, ContactID, contact) {
    return this.http
      .put(`${environment.server}/api/v1/client/${ClientId}/contacts/${ContactID}`, contact)
      .pipe(map((res: any) => res));
  }

  // Feb-13 Jatin
  getAllNotes(ClientId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/notes`)
      .pipe(map((res: any) => res));
  }

  createNote(ClientId, note) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/notes`, note)
      .pipe(map((res: any) => res));
  }

  deleteNote(ClientId, NoteDate, NoteTime) {
    return this.http
      .delete(`${environment.server}/api/v1/client/${ClientId}/notes/${NoteDate}/${NoteTime}`)
      .pipe(map((res: any) => res));
  }

  updateNote(ClientId, NoteDate, NoteTime, note) {
    return this.http
      .put(`${environment.server}/api/v1/client/${ClientId}/notes/${NoteDate}/${NoteTime}`, note)
      .pipe(map((res: any) => res));
  }

  getCustomFields(ClientId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/customfields`)
      .pipe(map((res: any) => res));
  }

  updateCustomField(ClientId, postData) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/customfields`, postData)
      .pipe(map((res: any) => res));
  }

  updateCustomFieldAll(ClientId, postData) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/customfields/all`, postData)
      .pipe(map((res: any) => res));
  }

  getReminders(ClientId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/reminders`)
      .pipe(map((res: any) => res));
  }

  // post the new reminder data on submit
  createReminder(ClientId, reminder) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/reminders`, reminder)
      .pipe(map((res: any) => res));
  }
  // for delete reminder
  deleteReminder(ClientId, ExpirationID) {
    return this.http
      .delete(`${environment.server}/api/v1/client/${ClientId}/reminders/${ExpirationID}`)
      .pipe(map((res: any) => res));
  }

  // post the new reminder data on submit
  updateReminder(ClientId, ExpirationID, reminder) {
    return this.http
      .put(`${environment.server}/api/v1/client/${ClientId}/reminders/${ExpirationID}`, reminder)
      .pipe(map((res: any) => res));
  }

  getAttachmentData(ClientId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/attachments`)
      .pipe(map((res: any) => res));
  }

  // for send attachment on server
  createAttachment(ClientId, attachment) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/attachments`, attachment)
      .pipe(map((res: any) => res));
  }

  // for update attachment on server
  updateAttachment(ClientId, AttachmentId, attachment) {
    return this.http
      .put(
        `${environment.server}/api/v1/client/${ClientId}/attachments/${AttachmentId}`,
        attachment
      )
      .pipe(map((res: any) => res));
  }

  // for delete attachment
  deleteAattachment(ClientId, AttachmentId) {
    return this.http
      .delete(`${environment.server}/api/v1/client/${ClientId}/attachments/${AttachmentId}`)
      .pipe(map((res: any) => res));
  }

  getInitialContact() {
    return this.http
      .get(environment.server + '/api/v1/client/getInitialContact')
      .pipe(map((res: any) => res));
  }

  fetchClientForHours(random, viewDate, view) {
    return this.http
      .get(
        environment.server +
          '/api/v1/client/hours/client/?_r=' +
          random +
          '&calendarTime=' +
          viewDate +
          '&type=' +
          view
      )
      .pipe(map((res: any) => res));
  }

  updateSkills(ClientId, postData) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/skills`, postData)
      .pipe(map((res: any) => res));
  }

  updateLanguages(ClientId, postData) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/languages`, postData)
      .pipe(map((res: any) => res));
  }

  updateAvailabilities(ClientId, postData) {
    return this.http
      .post(`${environment.server}/api/v1/client/${ClientId}/availabilities`, postData)
      .pipe(map((res: any) => res));
  }

  // for delete attachment
  downloadAttachment(ClientId, AttachmentId) {
    return this.http
      .get(`${environment.server}/api/v1/client/${ClientId}/attachments/${AttachmentId}/download`)
      .pipe(map((res: any) => res));
  }
}
