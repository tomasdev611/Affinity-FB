import {Action} from '@ngrx/store';
import {Client} from '../../core/models';

export enum ClientActionTypes {
  // clients associated with user
  LoadClients = '[Client] Load Clients',
  LoadClientsSuccess = '[Client] Load Clients Success',
  LoadClientsFailure = '[Client] Load Clients Failure',
  SetClientListPageInfo = '[Client] Set Client Page Info',

  // load single client
  LoadSingleClient = '[Client] Load Single Client',
  LoadSingleClientSuccess = '[Client] Load Single Client Success',
  LoadSingleClientFailure = '[Client] Load Single Client Failure',

  UpdateSingleClient = '[Client] Update Single Client',
  UpdateSingleClientSuccess = '[Client] Update Single Client Success',
  UpdateSingleClientFailure = '[Client] Update Single Client Failure',

  CreateSingleClient = '[Client] Create Single Client',
  CreateSingleClientSuccess = '[Client] Create Single Client Success',
  CreateSingleClientFailure = '[Client] Create Single Client Failure',

  // Client reminders
  LoadClientReminders = '[Client] Load Client Reminders',
  LoadClientRemindersSuccess = '[Client] Load Client Reminders Success',
  LoadClientRemindersFailure = '[Client] Load Client Reminders Failure',

  CreateClientReminders = '[Client] Create Client Reminders',
  CreateClientRemindersSuccess = '[Client] Create Client Reminders Success',
  CreateClientRemindersFailure = '[Client] Create Client Reminders Failure',

  UpdateClientReminders = '[Client] Update Client Reminders',
  UpdateClientRemindersSuccess = '[Client] Update Client Reminders Success',
  UpdateClientRemindersFailure = '[Client] Update Client Reminders Failure',

  DeleteClientReminders = '[Client] Delete Client Reminders',
  DeleteClientRemindersSuccess = '[Client] Delete Client Reminders Success',
  DeleteClientRemindersFailure = '[Client] Delete Client Reminders Failure',

  // Client visits
  LoadClientVisits = '[Client] Load Client Visits',
  LoadClientVisitsSuccess = '[Client] Load Client Visits Success',
  LoadClientVisitsFailure = '[Client] Load Client Visits Failure',

  // Client contacts
  LoadClientContacts = '[Client] Load Client Contacts',
  LoadClientContactsSuccess = '[Client] Load Client Contacts Success',
  LoadClientContactsFailure = '[Client] Load Client Contacts Failure',

  CreateClientContacts = '[Client] Create Client Contacts',
  CreateClientContactsSuccess = '[Client] Create Client Contacts Success',
  CreateClientContactsFailure = '[Client] Create Client Contacts Failure',

  UpdateClientContacts = '[Client] Update Client Contacts',
  UpdateClientContactsSuccess = '[Client] Update Client Contacts Success',
  UpdateClientContactsFailure = '[Client] Update Client Contacts Failure',

  DeleteClientContacts = '[Client] Delete Client Contacts',
  DeleteClientContactsSuccess = '[Client] Delete Client Contacts Success',
  DeleteClientContactsFailure = '[Client] Delete Client Contacts Failure',

  // Client attachments
  LoadClientAttachments = '[Client] Load Client Attachments',
  LoadClientAttachmentsSuccess = '[Client] Load Client Attachments Success',
  LoadClientAttachmentsFailure = '[Client] Load Client Attachments Failure',

  CreateClientAttachments = '[Client] Create Client Attachments',
  CreateClientAttachmentsSuccess = '[Client] Create Client Attachments Success',
  CreateClientAttachmentsFailure = '[Client] Create Client Attachments Failure',

  UpdateClientAttachments = '[Client] Update Client Attachments',
  UpdateClientAttachmentsSuccess = '[Client] Update Client Attachments Success',
  UpdateClientAttachmentsFailure = '[Client] Update Client Attachments Failure',

  DeleteClientAttachments = '[Client] Delete Client Attachments',
  DeleteClientAttachmentsSuccess = '[Client] Delete Client Attachments Success',
  DeleteClientAttachmentsFailure = '[Client] Delete Client Attachments Failure',

  // Client Notes
  LoadClientNotes = '[Client] Load Client Notes',
  LoadClientNotesSuccess = '[Client] Load Client Notes Success',
  LoadClientNotesFailure = '[Client] Load Client Notes Failure',

  CreateClientNotes = '[Client] Create Client Notes',
  CreateClientNotesSuccess = '[Client] Create Client Notes Success',
  CreateClientNotesFailure = '[Client] Create Client Notes Failure',

  UpdateClientNotes = '[Client] Update Client Notes',
  UpdateClientNotesSuccess = '[Client] Update Client Notes Success',
  UpdateClientNotesFailure = '[Client] Update Client Notes Failure',

  DeleteClientNotes = '[Client] Delete Client Notes',
  DeleteClientNotesSuccess = '[Client] Delete Client Notes Success',
  DeleteClientNotesFailure = '[Client] Delete Client Notes Failure',

  // Custom Fields
  LoadClientCustomFields = '[Client] Load Client CustomFields',
  LoadClientCustomFieldsSuccess = '[Client] Load Client CustomFields Success',
  LoadClientCustomFieldsFailure = '[Client] Load Client CustomFields Failure',

  UpdateClientCustomFields = '[Client] Update Client CustomFields',
  UpdateClientCustomFieldsSuccess = '[Client] Update Client CustomFields Success',
  UpdateClientCustomFieldsFailure = '[Client] Update Client CustomFields Failure',

  UpdateClientCustomFieldsAll = '[Client] Update Client CustomFields All',
  UpdateClientCustomFieldsAllSuccess = '[Client] Update Client CustomFields All Success',
  UpdateClientCustomFieldsAllFailure = '[Client] Update Client CustomFields All Failure',

  SetCurrentClientID = '[Client] Set Current Client ID',

  UpdateClientLanguages = '[Client] Update Client Languages',
  UpdateClientLanguagesSuccess = '[Client] Update Client Languages Success',
  UpdateClientLanguagesFailure = '[Client] Update Client Languages Failure',

  UpdateClientAvailabilities = '[Client] Update Client Availabilities',
  UpdateClientAvailabilitiesSuccess = '[Client] Update Client Availabilities Success',
  UpdateClientAvailabilitiesFailure = '[Client] Update Client Availabilities Failure',

  UpdateClientSkills = '[Client] Update Client Skills',
  UpdateClientSkillsSuccess = '[Client] Update Client Skills Success',
  UpdateClientSkillsFailure = '[Client] Update Client Skills Failure'
}

export class LoadClients implements Action {
  readonly type = ClientActionTypes.LoadClients;
  // constructor(public payload: User) {}
}

export class LoadClientsSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientsSuccess;
  constructor(public payload: any[]) {}
}

export class LoadClientsFailure implements Action {
  readonly type = ClientActionTypes.LoadClientsFailure;
}

export class SetClientListPageInfo implements Action {
  readonly type = ClientActionTypes.SetClientListPageInfo;
  constructor(public payload: any) {}
}

export class SetCurrentClientID implements Action {
  readonly type = ClientActionTypes.SetCurrentClientID;
  constructor(public payload: any) {}
}

export class LoadSingleClient implements Action {
  readonly type = ClientActionTypes.LoadSingleClient;

  constructor(public payload: any) {}
}

export class LoadSingleClientSuccess implements Action {
  readonly type = ClientActionTypes.LoadSingleClientSuccess;

  constructor(public payload: any) {}
}

export class LoadSingleClientFailure implements Action {
  readonly type = ClientActionTypes.LoadSingleClientFailure;
}

export class UpdateSingleClient implements Action {
  readonly type = ClientActionTypes.UpdateSingleClient;
  constructor(public payload: any) {}
}

export class UpdateSingleClientSuccess implements Action {
  readonly type = ClientActionTypes.UpdateSingleClientSuccess;
  constructor(public payload: any) {}
}

export class UpdateSingleClientFailure implements Action {
  readonly type = ClientActionTypes.UpdateSingleClientFailure;
}

export class CreateSingleClient implements Action {
  readonly type = ClientActionTypes.CreateSingleClient;
  constructor(public payload: any) {}
}

export class CreateSingleClientSuccess implements Action {
  readonly type = ClientActionTypes.CreateSingleClientSuccess;
  constructor(public payload: any) {}
}

export class CreateSingleClientFailure implements Action {
  readonly type = ClientActionTypes.CreateSingleClientFailure;
}

// Reminders
export class LoadClientReminders implements Action {
  readonly type = ClientActionTypes.LoadClientReminders;

  constructor(public payload: any) {}
}

export class LoadClientRemindersSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientRemindersSuccess;

  constructor(public payload: any) {}
}

export class LoadClientRemindersFailure implements Action {
  readonly type = ClientActionTypes.LoadClientRemindersFailure;
}

export class CreateClientReminders implements Action {
  readonly type = ClientActionTypes.CreateClientReminders;
  constructor(public payload: any) {}
}

export class CreateClientRemindersSuccess implements Action {
  readonly type = ClientActionTypes.CreateClientRemindersSuccess;
  constructor(public payload: any) {}
}

export class CreateClientRemindersFailure implements Action {
  readonly type = ClientActionTypes.CreateClientRemindersFailure;
}

export class UpdateClientReminders implements Action {
  readonly type = ClientActionTypes.UpdateClientReminders;
  constructor(public payload: any) {}
}

export class UpdateClientRemindersSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientRemindersSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientRemindersFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientRemindersFailure;
}

export class DeleteClientReminders implements Action {
  readonly type = ClientActionTypes.DeleteClientReminders;
  constructor(public payload: any) {}
}

export class DeleteClientRemindersSuccess implements Action {
  readonly type = ClientActionTypes.DeleteClientRemindersSuccess;
  constructor(public payload: any) {}
}

export class DeleteClientRemindersFailure implements Action {
  readonly type = ClientActionTypes.DeleteClientRemindersFailure;
}

export class LoadClientVisits implements Action {
  readonly type = ClientActionTypes.LoadClientVisits;

  constructor(public payload: any) {}
}

export class LoadClientVisitsSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientVisitsSuccess;

  constructor(public payload: any) {}
}

export class LoadClientVisitsFailure implements Action {
  readonly type = ClientActionTypes.LoadClientVisitsFailure;
}

export class LoadClientContacts implements Action {
  readonly type = ClientActionTypes.LoadClientContacts;

  constructor(public payload: any) {}
}

export class LoadClientContactsSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientContactsSuccess;

  constructor(public payload: any) {}
}

export class LoadClientContactsFailure implements Action {
  readonly type = ClientActionTypes.LoadClientContactsFailure;
}

export class CreateClientContacts implements Action {
  readonly type = ClientActionTypes.CreateClientContacts;
  constructor(public payload: any) {}
}

export class CreateClientContactsSuccess implements Action {
  readonly type = ClientActionTypes.CreateClientContactsSuccess;
  constructor(public payload: any) {}
}

export class CreateClientContactsFailure implements Action {
  readonly type = ClientActionTypes.CreateClientContactsFailure;
}

export class UpdateClientContacts implements Action {
  readonly type = ClientActionTypes.UpdateClientContacts;
  constructor(public payload: any) {}
}

export class UpdateClientContactsSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientContactsSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientContactsFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientContactsFailure;
}

export class DeleteClientContacts implements Action {
  readonly type = ClientActionTypes.DeleteClientContacts;
  constructor(public payload: any) {}
}

export class DeleteClientContactsSuccess implements Action {
  readonly type = ClientActionTypes.DeleteClientContactsSuccess;
  constructor(public payload: any) {}
}

export class DeleteClientContactsFailure implements Action {
  readonly type = ClientActionTypes.DeleteClientContactsFailure;
}

export class LoadClientAttachments implements Action {
  readonly type = ClientActionTypes.LoadClientAttachments;
  constructor(public payload: any) {}
}

export class LoadClientAttachmentsSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class LoadClientAttachmentsFailure implements Action {
  readonly type = ClientActionTypes.LoadClientAttachmentsFailure;
}

export class CreateClientAttachments implements Action {
  readonly type = ClientActionTypes.CreateClientAttachments;
  constructor(public payload: any) {}
}

export class CreateClientAttachmentsSuccess implements Action {
  readonly type = ClientActionTypes.CreateClientAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class CreateClientAttachmentsFailure implements Action {
  readonly type = ClientActionTypes.CreateClientAttachmentsFailure;
}

export class UpdateClientAttachments implements Action {
  readonly type = ClientActionTypes.UpdateClientAttachments;
  constructor(public payload: any) {}
}

export class UpdateClientAttachmentsSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientAttachmentsFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientAttachmentsFailure;
}

export class DeleteClientAttachments implements Action {
  readonly type = ClientActionTypes.DeleteClientAttachments;
  constructor(public payload: any) {}
}

export class DeleteClientAttachmentsSuccess implements Action {
  readonly type = ClientActionTypes.DeleteClientAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class DeleteClientAttachmentsFailure implements Action {
  readonly type = ClientActionTypes.DeleteClientAttachmentsFailure;
}

export class LoadClientNotes implements Action {
  readonly type = ClientActionTypes.LoadClientNotes;

  constructor(public payload: any) {}
}

export class LoadClientNotesSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientNotesSuccess;

  constructor(public payload: any) {}
}

export class LoadClientNotesFailure implements Action {
  readonly type = ClientActionTypes.LoadClientNotesFailure;
}

export class CreateClientNotes implements Action {
  readonly type = ClientActionTypes.CreateClientNotes;
  constructor(public payload: any) {}
}

export class CreateClientNotesSuccess implements Action {
  readonly type = ClientActionTypes.CreateClientNotesSuccess;
  constructor(public payload: any) {}
}

export class CreateClientNotesFailure implements Action {
  readonly type = ClientActionTypes.CreateClientNotesFailure;
}

export class UpdateClientNotes implements Action {
  readonly type = ClientActionTypes.UpdateClientNotes;
  constructor(public payload: any) {}
}

export class UpdateClientNotesSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientNotesSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientNotesFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientNotesFailure;
}

export class DeleteClientNotes implements Action {
  readonly type = ClientActionTypes.DeleteClientNotes;
  constructor(public payload: any) {}
}

export class DeleteClientNotesSuccess implements Action {
  readonly type = ClientActionTypes.DeleteClientNotesSuccess;
  constructor(public payload: any) {}
}

export class DeleteClientNotesFailure implements Action {
  readonly type = ClientActionTypes.DeleteClientNotesFailure;
}

export class LoadClientCustomFields implements Action {
  readonly type = ClientActionTypes.LoadClientCustomFields;

  constructor(public payload: any) {}
}

export class LoadClientCustomFieldsSuccess implements Action {
  readonly type = ClientActionTypes.LoadClientCustomFieldsSuccess;

  constructor(public payload: any) {}
}

export class LoadClientCustomFieldsFailure implements Action {
  readonly type = ClientActionTypes.LoadClientCustomFieldsFailure;
}

export class UpdateClientCustomFields implements Action {
  readonly type = ClientActionTypes.UpdateClientCustomFields;
  constructor(public payload: any) {}
}

export class UpdateClientCustomFieldsSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientCustomFieldsSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientCustomFieldsFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientCustomFieldsFailure;
}

export class UpdateClientCustomFieldsAll implements Action {
  readonly type = ClientActionTypes.UpdateClientCustomFieldsAll;
  constructor(public payload: any) {}
}

export class UpdateClientCustomFieldsAllSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientCustomFieldsAllSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientCustomFieldsAllFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientCustomFieldsAllFailure;
}

export class UpdateClientLanguages implements Action {
  readonly type = ClientActionTypes.UpdateClientLanguages;
  constructor(public payload: any) {}
}

export class UpdateClientLanguagesSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientLanguagesSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientLanguagesFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientLanguagesFailure;
}

export class UpdateClientAvailabilities implements Action {
  readonly type = ClientActionTypes.UpdateClientAvailabilities;
  constructor(public payload: any) {}
}

export class UpdateClientAvailabilitiesSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientAvailabilitiesSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientAvailabilitiesFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientAvailabilitiesFailure;
}

export class UpdateClientSkills implements Action {
  readonly type = ClientActionTypes.UpdateClientSkills;
  constructor(public payload: any) {}
}

export class UpdateClientSkillsSuccess implements Action {
  readonly type = ClientActionTypes.UpdateClientSkillsSuccess;
  constructor(public payload: any) {}
}

export class UpdateClientSkillsFailure implements Action {
  readonly type = ClientActionTypes.UpdateClientSkillsFailure;
}

export type ClientActions =
  | LoadClients
  | LoadClientsSuccess
  | LoadClientsFailure
  | SetClientListPageInfo
  | LoadSingleClient
  | LoadSingleClientSuccess
  | LoadSingleClientFailure
  | UpdateSingleClient
  | UpdateSingleClientFailure
  | UpdateSingleClientSuccess
  | CreateSingleClient
  | CreateSingleClientFailure
  | CreateSingleClientSuccess
  | LoadClientReminders
  | LoadClientRemindersSuccess
  | LoadClientRemindersFailure
  | CreateClientReminders
  | CreateClientRemindersFailure
  | CreateClientRemindersSuccess
  | UpdateClientReminders
  | UpdateClientRemindersFailure
  | UpdateClientRemindersSuccess
  | DeleteClientReminders
  | DeleteClientRemindersFailure
  | DeleteClientRemindersSuccess
  | LoadClientVisits
  | LoadClientVisitsSuccess
  | LoadClientVisitsFailure
  | LoadClientContacts
  | LoadClientContactsSuccess
  | LoadClientContactsFailure
  | CreateClientContacts
  | CreateClientContactsFailure
  | CreateClientContactsSuccess
  | UpdateClientContacts
  | UpdateClientContactsFailure
  | UpdateClientContactsSuccess
  | DeleteClientContacts
  | DeleteClientContactsFailure
  | DeleteClientContactsSuccess
  | LoadClientAttachments
  | LoadClientAttachmentsSuccess
  | LoadClientAttachmentsFailure
  | CreateClientAttachments
  | CreateClientAttachmentsFailure
  | CreateClientAttachmentsSuccess
  | UpdateClientAttachments
  | UpdateClientAttachmentsFailure
  | UpdateClientAttachmentsSuccess
  | DeleteClientAttachments
  | DeleteClientAttachmentsFailure
  | DeleteClientAttachmentsSuccess
  | LoadClientNotes
  | LoadClientNotesSuccess
  | LoadClientNotesFailure
  | CreateClientNotes
  | CreateClientNotesFailure
  | CreateClientNotesSuccess
  | UpdateClientNotes
  | UpdateClientNotesFailure
  | UpdateClientNotesSuccess
  | DeleteClientNotes
  | DeleteClientNotesFailure
  | DeleteClientNotesSuccess
  | LoadClientCustomFields
  | LoadClientCustomFieldsSuccess
  | LoadClientCustomFieldsFailure
  | UpdateClientCustomFields
  | UpdateClientCustomFieldsFailure
  | UpdateClientCustomFieldsSuccess
  | UpdateClientCustomFieldsAll
  | UpdateClientCustomFieldsAllFailure
  | UpdateClientCustomFieldsAllSuccess
  | UpdateClientAvailabilities
  | UpdateClientAvailabilitiesFailure
  | UpdateClientAvailabilitiesSuccess
  | UpdateClientLanguages
  | UpdateClientLanguagesFailure
  | UpdateClientLanguagesSuccess
  | UpdateClientSkills
  | UpdateClientSkillsFailure
  | UpdateClientSkillsSuccess
  | SetCurrentClientID;
