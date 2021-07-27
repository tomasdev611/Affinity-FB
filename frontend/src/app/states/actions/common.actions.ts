import {Action} from '@ngrx/store';
// import { Common } from '../../core/models';

export enum CommonActionTypes {
  // commons associated with user
  LoadClientCommonInfo = '[Common] Load Client CommonInfo',
  LoadClientCommonInfoSuccess = '[Common] Load Client CommonInfo Success',
  LoadClientCommonInfoFailure = '[Common] Load Client CommonInfo Failure',

  LoadCommonInfo = '[Common] Load CommonInfo',
  LoadCommonInfoSuccess = '[Common] Load CommonInfo Success',
  LoadCommonInfoFailure = '[Common] Load CommonInfo Failure',

  CreateCommonData = '[Common] Create Data',
  CreateCommonDataSuccess = '[Common] Create Data Success',
  CreateCommonDataFailure = '[Common] Create Data Failure',

  UpdateCommonData = '[Common] Update Data',
  UpdateCommonDataSuccess = '[Common] Update Data Success',
  UpdateCommonDataFailure = '[Common] Update Data Failure',

  DeleteCommonData = '[Common] Delete Data',
  DeleteCommonDataSuccess = '[Common] Delete Data Success',
  DeleteCommonDataFailure = '[Common] Delete Data Failure'
}

export class LoadClientCommonInfo implements Action {
  readonly type = CommonActionTypes.LoadClientCommonInfo;
  // constructor(public payload: User) {}
}

export class LoadClientCommonInfoSuccess implements Action {
  readonly type = CommonActionTypes.LoadClientCommonInfoSuccess;
  constructor(public payload: any) {}
}
export class LoadClientCommonInfoFailure implements Action {
  readonly type = CommonActionTypes.LoadClientCommonInfoFailure;
}

export class LoadCommonInfo implements Action {
  readonly type = CommonActionTypes.LoadCommonInfo;
  // constructor(public payload: User) {}
}

export class LoadCommonInfoSuccess implements Action {
  readonly type = CommonActionTypes.LoadCommonInfoSuccess;
  constructor(public payload: any) {}
}
export class LoadCommonInfoFailure implements Action {
  readonly type = CommonActionTypes.LoadCommonInfoFailure;
}

export class CreateCommonData implements Action {
  readonly type = CommonActionTypes.CreateCommonData;
  constructor(public payload: any) {}
}

export class CreateCommonDataSuccess implements Action {
  readonly type = CommonActionTypes.CreateCommonDataSuccess;
  constructor(public payload: any) {}
}

export class CreateCommonDataFailure implements Action {
  readonly type = CommonActionTypes.CreateCommonDataFailure;
}

export class UpdateCommonData implements Action {
  readonly type = CommonActionTypes.UpdateCommonData;
  constructor(public payload: any) {}
}

export class UpdateCommonDataSuccess implements Action {
  readonly type = CommonActionTypes.UpdateCommonDataSuccess;
  constructor(public payload: any) {}
}

export class UpdateCommonDataFailure implements Action {
  readonly type = CommonActionTypes.UpdateCommonDataFailure;
}

export class DeleteCommonData implements Action {
  readonly type = CommonActionTypes.DeleteCommonData;
  constructor(public payload: any) {}
}

export class DeleteCommonDataSuccess implements Action {
  readonly type = CommonActionTypes.DeleteCommonDataSuccess;
  constructor(public payload: any) {}
}

export class DeleteCommonDataFailure implements Action {
  readonly type = CommonActionTypes.DeleteCommonDataFailure;
}

export type CommonActions =
  | LoadClientCommonInfo
  | LoadClientCommonInfoSuccess
  | LoadClientCommonInfoFailure
  | LoadCommonInfo
  | LoadCommonInfoSuccess
  | LoadCommonInfoFailure
  | CreateCommonData
  | CreateCommonDataSuccess
  | CreateCommonDataFailure
  | UpdateCommonData
  | UpdateCommonDataSuccess
  | UpdateCommonDataFailure
  | DeleteCommonData
  | DeleteCommonDataFailure
  | DeleteCommonDataSuccess;
