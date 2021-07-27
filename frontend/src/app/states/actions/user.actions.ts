import {Action} from '@ngrx/store';

export enum UserActionTypes {
  // users associated with user
  LoadUsers = '[User] Load Users',
  LoadUsersSuccess = '[User] Load Users Success',
  LoadUsersFailure = '[User] Load Users Failure',
  SetUserListPageInfo = '[User] Set User Page Info',
  SetCurrentUserUserName = '[Caregiver] Set Current User UserName',
  // load single user
  LoadSingleUser = '[User] Load Single User',
  LoadSingleUserSuccess = '[User] Load Single User Success',
  LoadSingleUserFailure = '[User] Load Single User Failure',

  UpdateSingleUser = '[User] Update Single User',
  UpdateSingleUserSuccess = '[User] Update Single User Success',
  UpdateSingleUserFailure = '[User] Update Single User Failure',

  CreateSingleUser = '[User] Create Single User',
  CreateSingleUserSuccess = '[User] Create Single User Success',
  CreateSingleUserFailure = '[User] Create Single User Failure',

  UpdateSingleUserPassword = '[User] Update Single User Password',
  UpdateSingleUserPasswordSuccess = '[User] Update Single User Password Success',
  UpdateSingleUserPasswordFailure = '[User] Update Single User Password Failure',

  DeleteSingleUser = '[User] Delete Single User',
  DeleteSingleUserSuccess = '[User] Delete Single User Success',
  DeleteSingleUserFailure = '[User] Delete Single User Failure'
}

export class LoadUsers implements Action {
  readonly type = UserActionTypes.LoadUsers;
}

export class LoadUsersSuccess implements Action {
  readonly type = UserActionTypes.LoadUsersSuccess;
  constructor(public payload: any[]) {}
}

export class LoadUsersFailure implements Action {
  readonly type = UserActionTypes.LoadUsersFailure;
}

export class SetUserListPageInfo implements Action {
  readonly type = UserActionTypes.SetUserListPageInfo;
  constructor(public payload: any) {}
}

export class SetCurrentUserUserName implements Action {
  readonly type = UserActionTypes.SetCurrentUserUserName;
  constructor(public payload: any) {}
}

export class LoadSingleUser implements Action {
  readonly type = UserActionTypes.LoadSingleUser;

  constructor(public payload: any) {}
}

export class LoadSingleUserSuccess implements Action {
  readonly type = UserActionTypes.LoadSingleUserSuccess;

  constructor(public payload: any) {}
}

export class LoadSingleUserFailure implements Action {
  readonly type = UserActionTypes.LoadSingleUserFailure;
}

export class UpdateSingleUser implements Action {
  readonly type = UserActionTypes.UpdateSingleUser;
  constructor(public payload: any) {}
}

export class UpdateSingleUserSuccess implements Action {
  readonly type = UserActionTypes.UpdateSingleUserSuccess;
  constructor(public payload: any) {}
}

export class UpdateSingleUserFailure implements Action {
  readonly type = UserActionTypes.UpdateSingleUserFailure;
}

export class UpdateSingleUserPassword implements Action {
  readonly type = UserActionTypes.UpdateSingleUserPassword;
  constructor(public payload: any) {}
}

export class UpdateSingleUserPasswordSuccess implements Action {
  readonly type = UserActionTypes.UpdateSingleUserPasswordSuccess;
  constructor(public payload: any) {}
}

export class UpdateSingleUserPasswordFailure implements Action {
  readonly type = UserActionTypes.UpdateSingleUserPasswordFailure;
}

export class CreateSingleUser implements Action {
  readonly type = UserActionTypes.CreateSingleUser;
  constructor(public payload: any) {}
}

export class CreateSingleUserSuccess implements Action {
  readonly type = UserActionTypes.CreateSingleUserSuccess;
  constructor(public payload: any) {}
}

export class CreateSingleUserFailure implements Action {
  readonly type = UserActionTypes.CreateSingleUserFailure;
}

export class DeleteSingleUser implements Action {
  readonly type = UserActionTypes.DeleteSingleUser;
  constructor(public payload: any) {}
}

export class DeleteSingleUserSuccess implements Action {
  readonly type = UserActionTypes.DeleteSingleUserSuccess;
  constructor(public payload: any) {}
}

export class DeleteSingleUserFailure implements Action {
  readonly type = UserActionTypes.DeleteSingleUserFailure;
}

export type UserActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFailure
  | SetUserListPageInfo
  | LoadSingleUser
  | LoadSingleUserSuccess
  | LoadSingleUserFailure
  | UpdateSingleUser
  | UpdateSingleUserFailure
  | UpdateSingleUserSuccess
  | UpdateSingleUserPassword
  | UpdateSingleUserPasswordFailure
  | UpdateSingleUserPasswordSuccess
  | CreateSingleUser
  | CreateSingleUserFailure
  | CreateSingleUserSuccess
  | DeleteSingleUser
  | DeleteSingleUserFailure
  | DeleteSingleUserSuccess
  | SetCurrentUserUserName;
