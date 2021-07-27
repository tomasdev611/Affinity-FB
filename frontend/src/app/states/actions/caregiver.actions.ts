import {Action} from '@ngrx/store';

export enum CaregiverActionTypes {
  // caregivers associated with user
  LoadCaregivers = '[Caregiver] Load Caregivers',
  LoadCaregiversSuccess = '[Caregiver] Load Caregivers Success',
  LoadCaregiversFailure = '[Caregiver] Load Caregivers Failure',
  SetCaregiverListPageInfo = '[Caregiver] Set Caregiver Page Info',

  // caregivers associated with user
  SearchCaregivers = '[Caregiver] Search Caregivers',
  SearchCaregiversSuccess = '[Caregiver] Search Caregivers Success',
  SearchCaregiversFailure = '[Caregiver] Search Caregivers Failure',
  SetCaregiverSearchPageInfo = '[Caregiver] Set Caregiver Search Page Info',
  SearchCaregiversReset = '[Caregiver] Search Caregivers Reset',

  GetSearchCaregiversPage = '[Caregiver] Get Search Caregivers Page',
  GetSearchCaregiversPageSuccess = '[Caregiver] Get Search Caregivers Page Success',
  GetSearchCaregiversPageFailure = '[Caregiver] Get Search Caregivers Page Failure',

  GetSearchCaregiversPageForRemove = '[Caregiver] Get Search Caregivers Page ForRemove',
  GetSearchCaregiversPageForRemoveSuccess = '[Caregiver] Get Search Caregivers Page ForRemove Success',
  GetSearchCaregiversPageForRemoveFailure = '[Caregiver] Get Search Caregivers Page ForRemove Failure',

  // load single caregiver
  LoadSingleCaregiver = '[Caregiver] Load Single Caregiver',
  LoadSingleCaregiverSuccess = '[Caregiver] Load Single Caregiver Success',
  LoadSingleCaregiverFailure = '[Caregiver] Load Single Caregiver Failure',

  UpdateSingleCaregiver = '[Caregiver] Update Single Caregiver',
  UpdateSingleCaregiverSuccess = '[Caregiver] Update Single Caregiver Success',
  UpdateSingleCaregiverFailure = '[Caregiver] Update Single Caregiver Failure',

  CreateSingleCaregiver = '[Caregiver] Create Single Caregiver',
  CreateSingleCaregiverSuccess = '[Caregiver] Create Single Caregiver Success',
  CreateSingleCaregiverFailure = '[Caregiver] Create Single Caregiver Failure',

  // Caregiver reminders
  LoadCaregiverReminders = '[Caregiver] Load Caregiver Reminders',
  LoadCaregiverRemindersSuccess = '[Caregiver] Load Caregiver Reminders Success',
  LoadCaregiverRemindersFailure = '[Caregiver] Load Caregiver Reminders Failure',

  CreateCaregiverReminders = '[Caregiver] Create Caregiver Reminders',
  CreateCaregiverRemindersSuccess = '[Caregiver] Create Caregiver Reminders Success',
  CreateCaregiverRemindersFailure = '[Caregiver] Create Caregiver Reminders Failure',

  UpdateCaregiverReminders = '[Caregiver] Update Caregiver Reminders',
  UpdateCaregiverRemindersSuccess = '[Caregiver] Update Caregiver Reminders Success',
  UpdateCaregiverRemindersFailure = '[Caregiver] Update Caregiver Reminders Failure',

  DeleteCaregiverReminders = '[Caregiver] Delete Caregiver Reminders',
  DeleteCaregiverRemindersSuccess = '[Caregiver] Delete Caregiver Reminders Success',
  DeleteCaregiverRemindersFailure = '[Caregiver] Delete Caregiver Reminders Failure',

  // Caregiver visits
  LoadCaregiverVisits = '[Caregiver] Load Caregiver Visits',
  LoadCaregiverVisitsSuccess = '[Caregiver] Load Caregiver Visits Success',
  LoadCaregiverVisitsFailure = '[Caregiver] Load Caregiver Visits Failure',

  // Caregiver contacts
  LoadCaregiverContacts = '[Caregiver] Load Caregiver Contacts',
  LoadCaregiverContactsSuccess = '[Caregiver] Load Caregiver Contacts Success',
  LoadCaregiverContactsFailure = '[Caregiver] Load Caregiver Contacts Failure',

  CreateCaregiverContacts = '[Caregiver] Create Caregiver Contacts',
  CreateCaregiverContactsSuccess = '[Caregiver] Create Caregiver Contacts Success',
  CreateCaregiverContactsFailure = '[Caregiver] Create Caregiver Contacts Failure',

  UpdateCaregiverContacts = '[Caregiver] Update Caregiver Contacts',
  UpdateCaregiverContactsSuccess = '[Caregiver] Update Caregiver Contacts Success',
  UpdateCaregiverContactsFailure = '[Caregiver] Update Caregiver Contacts Failure',

  DeleteCaregiverContacts = '[Caregiver] Delete Caregiver Contacts',
  DeleteCaregiverContactsSuccess = '[Caregiver] Delete Caregiver Contacts Success',
  DeleteCaregiverContactsFailure = '[Caregiver] Delete Caregiver Contacts Failure',

  // Caregiver attachments
  LoadCaregiverAttachments = '[Caregiver] Load Caregiver Attachments',
  LoadCaregiverAttachmentsSuccess = '[Caregiver] Load Caregiver Attachments Success',
  LoadCaregiverAttachmentsFailure = '[Caregiver] Load Caregiver Attachments Failure',

  CreateCaregiverAttachments = '[Caregiver] Create Caregiver Attachments',
  CreateCaregiverAttachmentsSuccess = '[Caregiver] Create Caregiver Attachments Success',
  CreateCaregiverAttachmentsFailure = '[Caregiver] Create Caregiver Attachments Failure',

  UpdateCaregiverAttachments = '[Caregiver] Update Caregiver Attachments',
  UpdateCaregiverAttachmentsSuccess = '[Caregiver] Update Caregiver Attachments Success',
  UpdateCaregiverAttachmentsFailure = '[Caregiver] Update Caregiver Attachments Failure',

  DeleteCaregiverAttachments = '[Caregiver] Delete Caregiver Attachments',
  DeleteCaregiverAttachmentsSuccess = '[Caregiver] Delete Caregiver Attachments Success',
  DeleteCaregiverAttachmentsFailure = '[Caregiver] Delete Caregiver Attachments Failure',

  DownloadCaregiverAttachments = '[Caregiver] Download Caregiver Attachments',
  DownloadCaregiverAttachmentsSuccess = '[Caregiver] Download Caregiver Attachments Success',
  DownloadCaregiverAttachmentsFailure = '[Caregiver] Download Caregiver Attachments Failure',

  // Caregiver Notes
  LoadCaregiverNotes = '[Caregiver] Load Caregiver Notes',
  LoadCaregiverNotesSuccess = '[Caregiver] Load Caregiver Notes Success',
  LoadCaregiverNotesFailure = '[Caregiver] Load Caregiver Notes Failure',

  CreateCaregiverNotes = '[Caregiver] Create Caregiver Notes',
  CreateCaregiverNotesSuccess = '[Caregiver] Create Caregiver Notes Success',
  CreateCaregiverNotesFailure = '[Caregiver] Create Caregiver Notes Failure',

  UpdateCaregiverNotes = '[Caregiver] Update Caregiver Notes',
  UpdateCaregiverNotesSuccess = '[Caregiver] Update Caregiver Notes Success',
  UpdateCaregiverNotesFailure = '[Caregiver] Update Caregiver Notes Failure',

  DeleteCaregiverNotes = '[Caregiver] Delete Caregiver Notes',
  DeleteCaregiverNotesSuccess = '[Caregiver] Delete Caregiver Notes Success',
  DeleteCaregiverNotesFailure = '[Caregiver] Delete Caregiver Notes Failure',

  // Custom Fields
  LoadCaregiverCustomFields = '[Caregiver] Load Caregiver CustomFields',
  LoadCaregiverCustomFieldsSuccess = '[Caregiver] Load Caregiver CustomFields Success',
  LoadCaregiverCustomFieldsFailure = '[Caregiver] Load Caregiver CustomFields Failure',

  UpdateCaregiverCustomFields = '[Caregiver] Update Caregiver CustomFields',
  UpdateCaregiverCustomFieldsSuccess = '[Caregiver] Update Caregiver CustomFields Success',
  UpdateCaregiverCustomFieldsFailure = '[Caregiver] Update Caregiver CustomFields Failure',

  UpdateCaregiverCustomFieldsAll = '[Caregiver] Update Caregiver CustomFields All',
  UpdateCaregiverCustomFieldsAllSuccess = '[Caregiver] Update Caregiver CustomFields All Success',
  UpdateCaregiverCustomFieldsAllFailure = '[Caregiver] Update Caregiver CustomFields All Failure',

  UpdateCaregiverLanguages = '[Caregiver] Update Caregiver Languages',
  UpdateCaregiverLanguagesSuccess = '[Caregiver] Update Caregiver Languages Success',
  UpdateCaregiverLanguagesFailure = '[Caregiver] Update Caregiver Languages Failure',

  UpdateCaregiverAvailabilities = '[Caregiver] Update Caregiver Availabilities',
  UpdateCaregiverAvailabilitiesSuccess = '[Caregiver] Update Caregiver Availabilities Success',
  UpdateCaregiverAvailabilitiesFailure = '[Caregiver] Update Caregiver Availabilities Failure',

  UpdateCaregiverSkills = '[Caregiver] Update Caregiver Skills',
  UpdateCaregiverSkillsSuccess = '[Caregiver] Update Caregiver Skills Success',
  UpdateCaregiverSkillsFailure = '[Caregiver] Update Caregiver Skills Failure',

  SetCurrentCaregiverSocialSecurityNum = '[Caregiver] Set Current Caregiver SocialSecurityNum'
}

export class LoadCaregivers implements Action {
  readonly type = CaregiverActionTypes.LoadCaregivers;
  // constructor(public payload: User) {}
}

export class LoadCaregiversSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiversSuccess;
  constructor(public payload: any[]) {}
}

export class LoadCaregiversFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiversFailure;
}

export class SetCaregiverListPageInfo implements Action {
  readonly type = CaregiverActionTypes.SetCaregiverListPageInfo;
  constructor(public payload: any) {}
}

export class SearchCaregivers implements Action {
  readonly type = CaregiverActionTypes.SearchCaregivers;
  constructor(public payload: any) {}
}

export class SearchCaregiversSuccess implements Action {
  readonly type = CaregiverActionTypes.SearchCaregiversSuccess;
  constructor(public payload: any) {}
}

export class SearchCaregiversFailure implements Action {
  readonly type = CaregiverActionTypes.SearchCaregiversFailure;
}

export class SearchCaregiversReset implements Action {
  readonly type = CaregiverActionTypes.SearchCaregiversReset;
}

export class SetCaregiverSearchPageInfo implements Action {
  readonly type = CaregiverActionTypes.SetCaregiverSearchPageInfo;
  constructor(public payload: any) {}
}
export class GetSearchCaregiversPage implements Action {
  readonly type = CaregiverActionTypes.GetSearchCaregiversPage;
  constructor(public payload: any) {}
}

export class GetSearchCaregiversPageSuccess implements Action {
  readonly type = CaregiverActionTypes.GetSearchCaregiversPageSuccess;
  constructor(public payload: any) {}
}

export class GetSearchCaregiversPageFailure implements Action {
  readonly type = CaregiverActionTypes.GetSearchCaregiversPageFailure;
}
export class GetSearchCaregiversPageForRemove implements Action {
  readonly type = CaregiverActionTypes.GetSearchCaregiversPageForRemove;
  constructor(public payload: any) {}
}

export class GetSearchCaregiversPageForRemoveSuccess implements Action {
  readonly type = CaregiverActionTypes.GetSearchCaregiversPageForRemoveSuccess;
  constructor(public payload: any) {}
}

export class GetSearchCaregiversPageForRemoveFailure implements Action {
  readonly type = CaregiverActionTypes.GetSearchCaregiversPageForRemoveFailure;
}

export class SetCurrentCaregiverSocialSecurityNum implements Action {
  readonly type = CaregiverActionTypes.SetCurrentCaregiverSocialSecurityNum;
  constructor(public payload: any) {}
}

export class LoadSingleCaregiver implements Action {
  readonly type = CaregiverActionTypes.LoadSingleCaregiver;

  constructor(public payload: any) {}
}

export class LoadSingleCaregiverSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadSingleCaregiverSuccess;

  constructor(public payload: any) {}
}

export class LoadSingleCaregiverFailure implements Action {
  readonly type = CaregiverActionTypes.LoadSingleCaregiverFailure;
}

export class UpdateSingleCaregiver implements Action {
  readonly type = CaregiverActionTypes.UpdateSingleCaregiver;
  constructor(public payload: any) {}
}

export class UpdateSingleCaregiverSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateSingleCaregiverSuccess;
  constructor(public payload: any) {}
}

export class UpdateSingleCaregiverFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateSingleCaregiverFailure;
}

export class CreateSingleCaregiver implements Action {
  readonly type = CaregiverActionTypes.CreateSingleCaregiver;
  constructor(public payload: any) {}
}

export class CreateSingleCaregiverSuccess implements Action {
  readonly type = CaregiverActionTypes.CreateSingleCaregiverSuccess;
  constructor(public payload: any) {}
}

export class CreateSingleCaregiverFailure implements Action {
  readonly type = CaregiverActionTypes.CreateSingleCaregiverFailure;
}

// Reminders
export class LoadCaregiverReminders implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverReminders;

  constructor(public payload: any) {}
}

export class LoadCaregiverRemindersSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverRemindersSuccess;

  constructor(public payload: any) {}
}

export class LoadCaregiverRemindersFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverRemindersFailure;
}

export class CreateCaregiverReminders implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverReminders;
  constructor(public payload: any) {}
}

export class CreateCaregiverRemindersSuccess implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverRemindersSuccess;
  constructor(public payload: any) {}
}

export class CreateCaregiverRemindersFailure implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverRemindersFailure;
}

export class UpdateCaregiverReminders implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverReminders;
  constructor(public payload: any) {}
}

export class UpdateCaregiverRemindersSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverRemindersSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverRemindersFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverRemindersFailure;
}

export class DeleteCaregiverReminders implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverReminders;
  constructor(public payload: any) {}
}

export class DeleteCaregiverRemindersSuccess implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverRemindersSuccess;
  constructor(public payload: any) {}
}

export class DeleteCaregiverRemindersFailure implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverRemindersFailure;
}

export class LoadCaregiverVisits implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverVisits;

  constructor(public payload: any) {}
}

export class LoadCaregiverVisitsSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverVisitsSuccess;

  constructor(public payload: any) {}
}

export class LoadCaregiverVisitsFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverVisitsFailure;
}

export class LoadCaregiverContacts implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverContacts;

  constructor(public payload: any) {}
}

export class LoadCaregiverContactsSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverContactsSuccess;

  constructor(public payload: any) {}
}

export class LoadCaregiverContactsFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverContactsFailure;
}

export class CreateCaregiverContacts implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverContacts;
  constructor(public payload: any) {}
}

export class CreateCaregiverContactsSuccess implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverContactsSuccess;
  constructor(public payload: any) {}
}

export class CreateCaregiverContactsFailure implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverContactsFailure;
}

export class UpdateCaregiverContacts implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverContacts;
  constructor(public payload: any) {}
}

export class UpdateCaregiverContactsSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverContactsSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverContactsFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverContactsFailure;
}

export class DeleteCaregiverContacts implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverContacts;
  constructor(public payload: any) {}
}

export class DeleteCaregiverContactsSuccess implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverContactsSuccess;
  constructor(public payload: any) {}
}

export class DeleteCaregiverContactsFailure implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverContactsFailure;
}

export class LoadCaregiverAttachments implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverAttachments;
  constructor(public payload: any) {}
}

export class LoadCaregiverAttachmentsSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class LoadCaregiverAttachmentsFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverAttachmentsFailure;
}

export class CreateCaregiverAttachments implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverAttachments;
  constructor(public payload: any) {}
}

export class CreateCaregiverAttachmentsSuccess implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class CreateCaregiverAttachmentsFailure implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverAttachmentsFailure;
}

export class UpdateCaregiverAttachments implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverAttachments;
  constructor(public payload: any) {}
}

export class UpdateCaregiverAttachmentsSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverAttachmentsFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverAttachmentsFailure;
}

export class DeleteCaregiverAttachments implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverAttachments;
  constructor(public payload: any) {}
}

export class DeleteCaregiverAttachmentsSuccess implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class DeleteCaregiverAttachmentsFailure implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverAttachmentsFailure;
}

export class DownloadCaregiverAttachments implements Action {
  readonly type = CaregiverActionTypes.DownloadCaregiverAttachments;
  constructor(public payload: any) {}
}

export class DownloadCaregiverAttachmentsSuccess implements Action {
  readonly type = CaregiverActionTypes.DownloadCaregiverAttachmentsSuccess;
  constructor(public payload: any) {}
}

export class DownloadCaregiverAttachmentsFailure implements Action {
  readonly type = CaregiverActionTypes.DownloadCaregiverAttachmentsFailure;
}

export class LoadCaregiverNotes implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverNotes;

  constructor(public payload: any) {}
}

export class LoadCaregiverNotesSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverNotesSuccess;

  constructor(public payload: any) {}
}

export class LoadCaregiverNotesFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverNotesFailure;
}

export class CreateCaregiverNotes implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverNotes;
  constructor(public payload: any) {}
}

export class CreateCaregiverNotesSuccess implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverNotesSuccess;
  constructor(public payload: any) {}
}

export class CreateCaregiverNotesFailure implements Action {
  readonly type = CaregiverActionTypes.CreateCaregiverNotesFailure;
}

export class UpdateCaregiverNotes implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverNotes;
  constructor(public payload: any) {}
}

export class UpdateCaregiverNotesSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverNotesSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverNotesFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverNotesFailure;
}

export class DeleteCaregiverNotes implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverNotes;
  constructor(public payload: any) {}
}

export class DeleteCaregiverNotesSuccess implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverNotesSuccess;
  constructor(public payload: any) {}
}

export class DeleteCaregiverNotesFailure implements Action {
  readonly type = CaregiverActionTypes.DeleteCaregiverNotesFailure;
}

export class LoadCaregiverCustomFields implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverCustomFields;

  constructor(public payload: any) {}
}

export class LoadCaregiverCustomFieldsSuccess implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverCustomFieldsSuccess;

  constructor(public payload: any) {}
}

export class LoadCaregiverCustomFieldsFailure implements Action {
  readonly type = CaregiverActionTypes.LoadCaregiverCustomFieldsFailure;
}

export class UpdateCaregiverCustomFields implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverCustomFields;
  constructor(public payload: any) {}
}

export class UpdateCaregiverCustomFieldsSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverCustomFieldsSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverCustomFieldsFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverCustomFieldsFailure;
}

export class UpdateCaregiverCustomFieldsAll implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverCustomFieldsAll;
  constructor(public payload: any) {}
}

export class UpdateCaregiverCustomFieldsAllSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverCustomFieldsAllSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverCustomFieldsAllFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverCustomFieldsAllFailure;
}

export class UpdateCaregiverLanguages implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverLanguages;
  constructor(public payload: any) {}
}

export class UpdateCaregiverLanguagesSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverLanguagesSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverLanguagesFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverLanguagesFailure;
}

export class UpdateCaregiverAvailabilities implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverAvailabilities;
  constructor(public payload: any) {}
}

export class UpdateCaregiverAvailabilitiesSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverAvailabilitiesSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverAvailabilitiesFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverAvailabilitiesFailure;
}

export class UpdateCaregiverSkills implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverSkills;
  constructor(public payload: any) {}
}

export class UpdateCaregiverSkillsSuccess implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverSkillsSuccess;
  constructor(public payload: any) {}
}

export class UpdateCaregiverSkillsFailure implements Action {
  readonly type = CaregiverActionTypes.UpdateCaregiverSkillsFailure;
}

export type CaregiverActions =
  | LoadCaregivers
  | LoadCaregiversSuccess
  | LoadCaregiversFailure
  | SetCaregiverListPageInfo
  | SearchCaregivers
  | SearchCaregiversSuccess
  | SearchCaregiversFailure
  | SearchCaregiversReset
  | SetCaregiverSearchPageInfo
  | GetSearchCaregiversPage
  | GetSearchCaregiversPageSuccess
  | GetSearchCaregiversPageFailure
  | GetSearchCaregiversPageForRemove
  | GetSearchCaregiversPageForRemoveSuccess
  | GetSearchCaregiversPageForRemoveFailure
  | LoadSingleCaregiver
  | LoadSingleCaregiverSuccess
  | LoadSingleCaregiverFailure
  | UpdateSingleCaregiver
  | UpdateSingleCaregiverFailure
  | UpdateSingleCaregiverSuccess
  | CreateSingleCaregiver
  | CreateSingleCaregiverFailure
  | CreateSingleCaregiverSuccess
  | LoadCaregiverReminders
  | LoadCaregiverRemindersSuccess
  | LoadCaregiverRemindersFailure
  | CreateCaregiverReminders
  | CreateCaregiverRemindersFailure
  | CreateCaregiverRemindersSuccess
  | UpdateCaregiverReminders
  | UpdateCaregiverRemindersFailure
  | UpdateCaregiverRemindersSuccess
  | DeleteCaregiverReminders
  | DeleteCaregiverRemindersFailure
  | DeleteCaregiverRemindersSuccess
  | LoadCaregiverVisits
  | LoadCaregiverVisitsSuccess
  | LoadCaregiverVisitsFailure
  | LoadCaregiverContacts
  | LoadCaregiverContactsSuccess
  | LoadCaregiverContactsFailure
  | CreateCaregiverContacts
  | CreateCaregiverContactsFailure
  | CreateCaregiverContactsSuccess
  | UpdateCaregiverContacts
  | UpdateCaregiverContactsFailure
  | UpdateCaregiverContactsSuccess
  | DeleteCaregiverContacts
  | DeleteCaregiverContactsFailure
  | DeleteCaregiverContactsSuccess
  | LoadCaregiverAttachments
  | LoadCaregiverAttachmentsSuccess
  | LoadCaregiverAttachmentsFailure
  | CreateCaregiverAttachments
  | CreateCaregiverAttachmentsFailure
  | CreateCaregiverAttachmentsSuccess
  | UpdateCaregiverAttachments
  | UpdateCaregiverAttachmentsFailure
  | UpdateCaregiverAttachmentsSuccess
  | DeleteCaregiverAttachments
  | DeleteCaregiverAttachmentsFailure
  | DeleteCaregiverAttachmentsSuccess
  | DownloadCaregiverAttachments
  | DownloadCaregiverAttachmentsSuccess
  | DownloadCaregiverAttachmentsFailure
  | LoadCaregiverNotes
  | LoadCaregiverNotesSuccess
  | LoadCaregiverNotesFailure
  | CreateCaregiverNotes
  | CreateCaregiverNotesFailure
  | CreateCaregiverNotesSuccess
  | UpdateCaregiverNotes
  | UpdateCaregiverNotesFailure
  | UpdateCaregiverNotesSuccess
  | DeleteCaregiverNotes
  | DeleteCaregiverNotesFailure
  | DeleteCaregiverNotesSuccess
  | LoadCaregiverCustomFields
  | LoadCaregiverCustomFieldsSuccess
  | LoadCaregiverCustomFieldsFailure
  | UpdateCaregiverCustomFields
  | UpdateCaregiverCustomFieldsFailure
  | UpdateCaregiverCustomFieldsSuccess
  | UpdateCaregiverCustomFieldsAll
  | UpdateCaregiverCustomFieldsAllFailure
  | UpdateCaregiverCustomFieldsAllSuccess
  | UpdateCaregiverAvailabilities
  | UpdateCaregiverAvailabilitiesFailure
  | UpdateCaregiverAvailabilitiesSuccess
  | UpdateCaregiverLanguages
  | UpdateCaregiverLanguagesFailure
  | UpdateCaregiverLanguagesSuccess
  | UpdateCaregiverSkills
  | UpdateCaregiverSkillsFailure
  | UpdateCaregiverSkillsSuccess
  | SetCurrentCaregiverSocialSecurityNum;
