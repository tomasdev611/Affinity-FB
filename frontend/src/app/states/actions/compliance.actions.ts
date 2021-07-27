import {Action} from '@ngrx/store';

export enum ComplianceActionTypes {
  // compliances associated with user
  LoadClientCompliances = '[Compliance] Load Client Compliances',
  LoadClientCompliancesSuccess = '[Compliance] Load Client Compliances Success',
  LoadClientCompliancesFailure = '[Compliance] Load Client Compliances Failure',
  SetClientComplianceListPageInfo = '[Compliance] Set Client Compliance Page Info',

  LoadCaregiverCompliances = '[Compliance] Load Caregiver Compliances',
  LoadCaregiverCompliancesSuccess = '[Compliance] Load Caregiver Compliances Success',
  LoadCaregiverCompliancesFailure = '[Compliance] Load Caregiver Compliances Failure',
  SetCaregiverComplianceListPageInfo = '[Compliance] Set Caregiver Compliance Page Info',

  LoadCaregiverContacts = '[Compliance] Load Caregiver Contacts',
  LoadCaregiverContactsSuccess = '[Compliance] Load Caregiver Contacts Success',
  LoadCaregiverContactsFailure = '[Compliance] Load Caregiver Contacts Failure',
  SetCaregiverContactsPageInfo = '[Compliance] Set Caregiver Contacts Page Info',

  LoadClientContacts = '[Compliance] Load Client Contacts',
  LoadClientContactsSuccess = '[Compliance] Load Client Contacts Success',
  LoadClientContactsFailure = '[Compliance] Load Client Contacts Failure',
  SetClientContactsPageInfo = '[Compliance] Set Client Contacts Page Info'
}

export class LoadClientCompliances implements Action {
  readonly type = ComplianceActionTypes.LoadClientCompliances;
  constructor(public payload: any) {}
}

export class LoadClientCompliancesSuccess implements Action {
  readonly type = ComplianceActionTypes.LoadClientCompliancesSuccess;
  constructor(public payload: any[]) {}
}

export class LoadClientCompliancesFailure implements Action {
  readonly type = ComplianceActionTypes.LoadClientCompliancesFailure;
}

export class SetClientComplianceListPageInfo implements Action {
  readonly type = ComplianceActionTypes.SetClientComplianceListPageInfo;
  constructor(public payload: any) {}
}

export class LoadCaregiverCompliances implements Action {
  readonly type = ComplianceActionTypes.LoadCaregiverCompliances;
  constructor(public payload: any) {}
}

export class LoadCaregiverCompliancesSuccess implements Action {
  readonly type = ComplianceActionTypes.LoadCaregiverCompliancesSuccess;
  constructor(public payload: any[]) {}
}

export class LoadCaregiverCompliancesFailure implements Action {
  readonly type = ComplianceActionTypes.LoadCaregiverCompliancesFailure;
}

export class SetCaregiverComplianceListPageInfo implements Action {
  readonly type = ComplianceActionTypes.SetCaregiverComplianceListPageInfo;
  constructor(public payload: any) {}
}

export class LoadCaregiverContacts implements Action {
  readonly type = ComplianceActionTypes.LoadCaregiverContacts;
  constructor(public payload: any) {}
}

export class LoadCaregiverContactsSuccess implements Action {
  readonly type = ComplianceActionTypes.LoadCaregiverContactsSuccess;
  constructor(public payload: any[]) {}
}

export class LoadCaregiverContactsFailure implements Action {
  readonly type = ComplianceActionTypes.LoadCaregiverContactsFailure;
}

export class SetCaregiverContactsPageInfo implements Action {
  readonly type = ComplianceActionTypes.SetCaregiverContactsPageInfo;
  constructor(public payload: any) {}
}

export class LoadClientContacts implements Action {
  readonly type = ComplianceActionTypes.LoadClientContacts;
  constructor(public payload: any) {}
}

export class LoadClientContactsSuccess implements Action {
  readonly type = ComplianceActionTypes.LoadClientContactsSuccess;
  constructor(public payload: any[]) {}
}

export class LoadClientContactsFailure implements Action {
  readonly type = ComplianceActionTypes.LoadClientContactsFailure;
}

export class SetClientContactsPageInfo implements Action {
  readonly type = ComplianceActionTypes.SetClientContactsPageInfo;
  constructor(public payload: any) {}
}

export type ComplianceActions =
  | LoadClientCompliances
  | LoadClientCompliancesSuccess
  | LoadClientCompliancesFailure
  | SetClientComplianceListPageInfo
  | LoadCaregiverCompliances
  | LoadCaregiverCompliancesSuccess
  | LoadCaregiverCompliancesFailure
  | SetCaregiverComplianceListPageInfo
  | LoadCaregiverContacts
  | LoadCaregiverContactsFailure
  | LoadCaregiverContactsSuccess
  | SetCaregiverContactsPageInfo
  | LoadClientContacts
  | LoadClientContactsFailure
  | LoadClientContactsSuccess
  | SetClientContactsPageInfo;
