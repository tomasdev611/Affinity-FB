// import { User } from '../../core/models';
import {EntityState, createEntityAdapter} from '@ngrx/entity';
import {UserActions, UserActionTypes} from '../actions/user.actions';

export function selectUserUserName(a: any): string {
  //In this case this would be optional since primary key is id
  return a.userName;
}

const userAdapter = createEntityAdapter<any>({selectId: selectUserUserName});

export interface State extends EntityState<any> {
  loading: boolean;
  saving: string;
  currentUser: any;
  listPageInfo: any;
  userDetailMap: any;
}

export const defaultUserDetail = {
  userName: null,
  personaldata: null,
  reminders: null,
  attachments: null,
  visits: null,
  notes: null,
  customfields: null,
  contacts: null
};

export const initialState: State = {
  loading: false,
  saving: '',
  ids: [],
  entities: {},
  currentUser: null,
  userDetailMap: {
    currentUserUserName: null
  },
  listPageInfo: {
    statusFilter: 'active',
    filter: {},
    sort: {}
  }
};
const nyTimezoneOffSet = 300;

function isSameDocument(idField, data1, data2) {
  if (typeof idField === 'object') {
    let isNotSame = idField.some(f => data1[f] !== data2[f]);
    return !isNotSame;
  } else if (typeof idField === 'string') {
    return data1[idField] === data2[idField];
  }
  return false;
}

function setUserDataForDetailMap(userDetailMap, payload, extra = {}) {
  const {userName, response} = payload;

  if (response.personaldata) {
    response.personaldata = cleanUserData(response.personaldata);
  }
  let detailMap = {...userDetailMap, ...extra};
  let currentDetail = detailMap[userName] || {};
  currentDetail = {...currentDetail, ...response};
  detailMap[userName] = currentDetail;
  return detailMap;
}

const updateEntities = (state, payload) => {
  if (state.ids.length === 0) {
    return {};
  }
  const {response} = payload;

  if (response.personaldata) {
    let personaldata = cleanUserData(response.personaldata);
    if (payload.action === 'update') {
      return userAdapter.updateOne(
        {
          id: payload.userName,
          changes: personaldata
        },
        state
      );
    } else if (payload.action === 'create') {
      return userAdapter.addOne(personaldata, state);
    }
  }
  if (payload.action === 'delete') {
    return userAdapter.removeOne(payload.userName, state);
  }
  return {};
};

function setUserUserNameForDetailMap(userDetailMap, currentUserUserName) {
  let detailMap = {...userDetailMap, currentUserUserName};
  if (!detailMap[currentUserUserName]) {
    detailMap[currentUserUserName] = {
      userName: currentUserUserName
    };
  }
  return detailMap;
}

// Clean up birthday and etc
function cleanUserData(user) {
  let newUser = {...user};

  return newUser;
}

function getLocal(d, dtOffSet) {
  // convert UTC time in msec
  const utc = d.getTime() + dtOffSet * 60000;
  // create new Date object for current location
  // using local offset
  // this create date object in local timezone
  const nd = new Date(utc - 60000 * new Date().getTimezoneOffset());
  // return time as a string
  return nd;
}

export function reducer(state = initialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.LoadUsers:
      return {...state, loading: true};
    case UserActionTypes.LoadUsersSuccess:
      return {
        ...userAdapter.addAll(action.payload.map(user => cleanUserData(user)), state),
        loading: false
      };
    case UserActionTypes.LoadUsersFailure:
      return {...state, loading: false};
    case UserActionTypes.SetUserListPageInfo:
      return {...state, listPageInfo: {...state.listPageInfo, ...action.payload}};
    case UserActionTypes.LoadSingleUser:
      return {...state, loading: true};
    case UserActionTypes.LoadSingleUserSuccess:
      return {
        ...state,
        loading: false,
        userDetailMap: setUserDataForDetailMap(state.userDetailMap, action.payload)
      };
    case UserActionTypes.LoadSingleUserFailure:
      return {...state, loading: false};
    case UserActionTypes.CreateSingleUser:
    case UserActionTypes.UpdateSingleUser:
    case UserActionTypes.DeleteSingleUser:
    case UserActionTypes.UpdateSingleUserPassword:
      return {...state, saving: 'saving'};
    case UserActionTypes.UpdateSingleUserSuccess:
    case UserActionTypes.CreateSingleUserSuccess:
    case UserActionTypes.DeleteSingleUserSuccess:
      return {
        ...state,
        ...updateEntities(state, action.payload),
        userDetailMap: setUserDataForDetailMap(state.userDetailMap, action.payload),
        saving: 'success'
      };
    case UserActionTypes.UpdateSingleUserPasswordSuccess:
      return {...state, saving: 'success'};
    case UserActionTypes.CreateSingleUserFailure:
    case UserActionTypes.UpdateSingleUserFailure:
    case UserActionTypes.DeleteSingleUserFailure:
    case UserActionTypes.UpdateSingleUserPasswordFailure:
      return {...state, saving: 'error'};

    case UserActionTypes.SetCurrentUserUserName:
      return {
        ...state,
        loading: false,
        userDetailMap: setUserUserNameForDetailMap(state.userDetailMap, action.payload)
      };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
// export const getUsers = (state: State) => state.users;
export const getListPageInfo = (state: State) => state.listPageInfo;
export const getCurrentUser = (state: State) => state.currentUser;
export const getUserDetailMap = (state: State) => state.userDetailMap;
export const {selectIds, selectEntities, selectAll, selectTotal} = userAdapter.getSelectors();
