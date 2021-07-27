// import { Caregiver } from '../../core/models';
import {CaregiverActions, CalendarActionTypes} from '../actions/calendar.actions';

export interface State {
  loading: boolean;
  loaded: boolean;
  saving: string;
  caregivers: any;
  clients: any;
}

export const initialState: State = {
  loading: false,
  saving: '',
  loaded: false,
  caregivers: [],
  clients: []
};

export function reducer(state = initialState, action: CaregiverActions): State {
  switch (action.type) {
    case CalendarActionTypes.LoadClientCaregiverNames:
      return {...state, loading: true};
    case CalendarActionTypes.LoadClientCaregiverNamesSuccess:
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case CalendarActionTypes.LoadClientCaregiverNamesFailure:
      return {...state, loading: false};
    default:
      return state;
  }
}

// export const getLoading = (state: State) => state.loading;
// export const getSaving = (state: State) => state.saving;
// // export const getCaregivers = (state: State) => state.caregivers;
// export const getListPageInfo = (state: State) => state.listPageInfo;
// export const getCurrentCaregiver = (state: State) => state.currentCaregiver;
// export const getCaregiverDetailMap = (state: State) => state.caregiverDetailMap;
export const getCalendarInfo = (state: State) => state;
