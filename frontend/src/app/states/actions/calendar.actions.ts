import {Action} from '@ngrx/store';

export enum CalendarActionTypes {
  // caregivers associated with user
  LoadClientCaregiverNames = '[Calendar] Load Client Caregivers',
  LoadClientCaregiverNamesSuccess = '[Calendar] Load Client Caregivers Success',
  LoadClientCaregiverNamesFailure = '[Calendar] Load Client Caregivers Failure'
}

export class LoadClientCaregiverNames implements Action {
  readonly type = CalendarActionTypes.LoadClientCaregiverNames;
  // constructor(public payload: User) {}
}

export class LoadClientCaregiverNamesSuccess implements Action {
  readonly type = CalendarActionTypes.LoadClientCaregiverNamesSuccess;
  constructor(public payload: any) {}
}

export class LoadClientCaregiverNamesFailure implements Action {
  readonly type = CalendarActionTypes.LoadClientCaregiverNamesFailure;
}

export type CaregiverActions =
  | LoadClientCaregiverNames
  | LoadClientCaregiverNamesSuccess
  | LoadClientCaregiverNamesFailure;
