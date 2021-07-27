// import { User } from '../../core/models';
import {AuthActions, AuthActionTypes} from '../actions/auth.actions';

export interface State {
  loading: boolean;
  saving: string;
  user: any;
}

export const initialState: State = {
  loading: false,
  // loggingin: false,
  saving: '',
  user: null
};

export function reducer(state = initialState, action: AuthActions): State {
  switch (action.type) {
    case AuthActionTypes.Login:
      return {...state, loading: true};
    case AuthActionTypes.LoginSuccess:
      return {
        ...state,
        user: action.payload.user,
        loading: false
      };
    case AuthActionTypes.LoginFailure:
      return {...state, loading: false};
    case AuthActionTypes.LoadCurrentUserInfo:
      return {...state, loading: true};
    case AuthActionTypes.LoadCurrentUserInfoSuccess:
      return {...state, loading: false, user: action.payload.user};
    case AuthActionTypes.LoadCurrentUserInfoFailure:
      return {
        ...state,
        loading: false
      };
    case AuthActionTypes.Logout:
      return {...state, user: null};
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
export const getAuthUser = (state: State) => state.user;
