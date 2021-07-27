// import { Common } from '../../core/models';
import {CommonActions, CommonActionTypes} from '../actions/common.actions';

export interface State {
  loading: boolean;
  saving: string;
  data: any;
}

export const initialState: State = {
  loading: false,
  saving: '',
  data: {
    loaded: false,
    clientNoteTypes: [],
    reasons: [],
    initialContacts: [],
    caseManagers: [],
    relations: [],
    reminderDescriptions: [],
    locationData: [],
    referredBy: [],
    payors: [],
    physicians: [],
    clientTypes: [],
    counties: [],
    customfields: [],
    securityGroups: [],
    classesNames: [],
    availabilities: [],
    languages: [],
    clients: [],
    caregivers: [],
    phoneNumbers: [],
    securityUsers: []
  }
};

function isSameDocument(idInfo, idFields, data1) {
  let isNotSame = idFields.some((f, index) => data1[f] !== idInfo[index]);
  return !isNotSame;
}

function setCommonDataAfterUpdate(commonData, payload, extra = {}) {
  const {target, action, data, idInfo, idFields} = payload;

  let newCommonData = {...commonData};
  let targetSets = newCommonData[target];
  if (action === 'create') {
    targetSets = [data, ...targetSets];
  } else if (action === 'update') {
    targetSets = targetSets.map(row =>
      isSameDocument(idInfo, idFields, row) ? payload.data : row
    );
  } else if (action === 'delete') {
    targetSets = targetSets.filter(row => !isSameDocument(idInfo, idFields, row));
  }

  newCommonData[target] = targetSets;
  return newCommonData;
}

export function reducer(state = initialState, action: CommonActions): State {
  switch (action.type) {
    case CommonActionTypes.LoadClientCommonInfo:
      return {...state, loading: true};
    case CommonActionTypes.LoadClientCommonInfoSuccess:
      return {...state, data: {...state.data, ...action.payload, loaded: true}, loading: false};
    case CommonActionTypes.LoadClientCommonInfoFailure:
      return {...state, loading: false};
    case CommonActionTypes.LoadCommonInfo:
      return {...state, loading: true};
    case CommonActionTypes.LoadCommonInfoSuccess:
      return {...state, data: {...state.data, ...action.payload, loaded: true}, loading: false};
    case CommonActionTypes.LoadCommonInfoFailure:
      return {...state, loading: false};
    case CommonActionTypes.CreateCommonData:
    case CommonActionTypes.UpdateCommonData:
    case CommonActionTypes.DeleteCommonData:
      return {...state, saving: 'saving'};
    case CommonActionTypes.CreateCommonDataSuccess:
    case CommonActionTypes.UpdateCommonDataSuccess:
    case CommonActionTypes.DeleteCommonDataSuccess:
      return {
        ...state,
        saving: 'success',
        data: setCommonDataAfterUpdate(state.data, action.payload)
      };
    case CommonActionTypes.CreateCommonDataFailure:
    case CommonActionTypes.UpdateCommonDataFailure:
    case CommonActionTypes.DeleteCommonDataFailure:
      return {...state, saving: 'error'};
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getCommon = (state: State) => state.data;
export const getSaving = (state: State) => state.saving;
