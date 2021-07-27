import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import {environment} from '../../../environments/environment';
// import * as fromRouter from '@ngrx/router-store';
// import * as fromAuth from './auth.reducer';
import * as fromClient from './client.reducer';
import * as fromCaregiver from './caregiver.reducer';
import * as fromCommon from './common.reducer';
import * as fromUser from './user.reducer';
import * as fromAuth from './auth.reducer';
import * as fromCalendar from './calendar.reducer';
import * as fromCompliance from './compliance.reducer';
import * as fromMessage from './message.reducer';
import {storeLogger} from 'ngrx-store-logger';
// import { Group } from '@babelfish/core/model';

export function logger(reducer: ActionReducer<State>): any {
  // default, no options
  return storeLogger()(reducer);
}

export interface State {
  // router: fromRouter.RouterReducerState<any>;
  // auth: fromAuth.State;
  client: fromClient.State;
  caregiver: fromCaregiver.State;
  common: fromCommon.State;
  user: fromUser.State;
  auth: fromAuth.State;
  calendar: fromCalendar.State;
  message: fromMessage.State;
  compliance: fromCompliance.State;
}

export const reducers: ActionReducerMap<State> = {
  // router: fromRouter.routerReducer,
  // auth: fromAuth.reducer,
  client: fromClient.reducer,
  caregiver: fromCaregiver.reducer,
  common: fromCommon.reducer,
  user: fromUser.reducer,
  auth: fromAuth.reducer,
  calendar: fromCalendar.reducer,
  message: fromMessage.reducer,
  compliance: fromCompliance.reducer
};

// export const selectAuthState = createFeatureSelector<fromAuth.State>('auth');
export const selectClientState = createFeatureSelector<fromClient.State>('client');
export const selectCaregiverState = createFeatureSelector<fromCaregiver.State>('caregiver');
export const selectCommonState = createFeatureSelector<fromCommon.State>('common');
export const selectUserState = createFeatureSelector<fromUser.State>('user');
export const selectAuthState = createFeatureSelector<fromAuth.State>('auth');
export const selectCalendarState = createFeatureSelector<fromCalendar.State>('calendar');
export const selectMessageState = createFeatureSelector<fromMessage.State>('message');
export const selectComplianceState = createFeatureSelector<fromCompliance.State>('compliance');

// client selectors
export const getAuthUser = createSelector(
  selectAuthState,
  fromAuth.getAuthUser
);
export const getAuthSaving = createSelector(
  selectAuthState,
  fromAuth.getSaving
);
// client selectors
export const getAuthLoading = createSelector(
  selectAuthState,
  fromAuth.getLoading
);

// client selectors
export const getClients = createSelector(
  selectClientState,
  fromClient.selectAll
);
export const getCurrentClient = createSelector(
  selectClientState,
  fromClient.getCurrentClient
);
export const getClientLoading = createSelector(
  selectClientState,
  fromClient.getLoading
);
export const getClientSaving = createSelector(
  selectClientState,
  fromClient.getSaving
);
export const getClientListPageInfo = createSelector(
  selectClientState,
  fromClient.getListPageInfo
);
export const getClientDetailMap = createSelector(
  selectClientState,
  fromClient.getClientDetailMap
);

// caregiver selectors
export const getCaregivers = createSelector(
  selectCaregiverState,
  fromCaregiver.selectAll
);
export const getCaregiversSearchConsole = createSelector(
  selectCaregiverState,
  fromCaregiver.getSearchConsole
);
export const getCurrentCaregiver = createSelector(
  selectCaregiverState,
  fromCaregiver.getCurrentCaregiver
);
export const getCaregiverLoading = createSelector(
  selectCaregiverState,
  fromCaregiver.getLoading
);
export const getCaregiverSaving = createSelector(
  selectCaregiverState,
  fromCaregiver.getSaving
);
export const getCaregiverListPageInfo = createSelector(
  selectCaregiverState,
  fromCaregiver.getListPageInfo
);
export const getCaregiverDetailMap = createSelector(
  selectCaregiverState,
  fromCaregiver.getCaregiverDetailMap
);

// User Selectors
export const getUsers = createSelector(
  selectUserState,
  fromCaregiver.selectAll
);
export const getCurrentUser = createSelector(
  selectUserState,
  fromUser.getCurrentUser
);
export const getUserLoading = createSelector(
  selectUserState,
  fromUser.getLoading
);
export const getUserSaving = createSelector(
  selectUserState,
  fromUser.getSaving
);
export const getUserListPageInfo = createSelector(
  selectUserState,
  fromUser.getListPageInfo
);
export const getUserDetailMap = createSelector(
  selectUserState,
  fromUser.getUserDetailMap
);

// Common Selectors
export const getCommon = createSelector(
  selectCommonState,
  fromCommon.getCommon
);
export const getCommonSaving = createSelector(
  selectCommonState,
  fromCommon.getSaving
);

export const getCommonLoading = createSelector(
  selectCommonState,
  fromCommon.getLoading
);

export const getCalendarInfo = createSelector(
  selectCalendarState,
  fromCalendar.getCalendarInfo
);

// Message

export const getChatRoomInfo = createSelector(
  selectMessageState,
  fromMessage.getChatRoomInfo
);

export const getMessageGroupInfo = createSelector(
  selectMessageState,
  fromMessage.getMessageGroupInfo
);

export const getUnreadsInfo = createSelector(
  selectMessageState,
  fromMessage.getUnreadsInfo
);

// Compliance

export const getComplianceClientListPageInfo = createSelector(
  selectComplianceState,
  fromCompliance.getClientListPageInfo
);

export const getComplianceClientReports = createSelector(
  selectComplianceState,
  fromCompliance.getReportsClientCompliances
);

export const getComplianceCaregiverListPageInfo = createSelector(
  selectComplianceState,
  fromCompliance.getCaregiverListPageInfo
);

export const getComplianceCaregiverReports = createSelector(
  selectComplianceState,
  fromCompliance.getReportsCaregiverCompliances
);

export const getComplianceLoading = createSelector(
  selectComplianceState,
  fromCompliance.getLoading
);

export const getComplianceCaregiverContacts = createSelector(
  selectComplianceState,
  fromCompliance.getCaregiverContacts
);

export const getComplianceClientContacts = createSelector(
  selectComplianceState,
  fromCompliance.getClientContacts
);

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
