import {Action} from '@ngrx/store';

export enum AuthActionTypes {
  // users associated with user
  Login = '[Auth] Login',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',

  // load single user
  LoadCurrentUserInfo = '[Auth] Load Current User Info',
  LoadCurrentUserInfoSuccess = '[User] Current User Info Success',
  LoadCurrentUserInfoFailure = '[User] Current User Info Failure',

  Logout = '[Auth] Logout'
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;
  constructor(public payload: any) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;
  constructor(public payload: any) {}
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;
}

export class LoadCurrentUserInfo implements Action {
  readonly type = AuthActionTypes.LoadCurrentUserInfo;
}

export class LoadCurrentUserInfoSuccess implements Action {
  readonly type = AuthActionTypes.LoadCurrentUserInfoSuccess;
  constructor(public payload: any) {}
}

export class LoadCurrentUserInfoFailure implements Action {
  readonly type = AuthActionTypes.LoadCurrentUserInfoFailure;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}
export type AuthActions =
  | Login
  | LoginSuccess
  | LoginFailure
  | LoadCurrentUserInfo
  | LoadCurrentUserInfoSuccess
  | LoadCurrentUserInfoFailure
  | Logout;
