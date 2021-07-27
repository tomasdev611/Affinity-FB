// import { Caregiver } from '../../core/models';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import {cloneDeep, pick, omit} from 'lodash';
import {EntityState, createEntityAdapter} from '@ngrx/entity';
import {CaregiverActions, CaregiverActionTypes} from '../actions/caregiver.actions';
import {convertBufferToImageURI} from '../../utils/helpers';

export function selectCaregiverSocialSecurityNum(a: any): string {
  //In this case this would be optional since primary key is id
  return a.SocialSecurityNum;
}

const caregiverAdapter = createEntityAdapter<any>({selectId: selectCaregiverSocialSecurityNum});
// const DEFAULT_CAREGIVER_
export interface State extends EntityState<any> {
  loading: boolean;
  saving: string;
  currentCaregiver: any;
  listPageInfo: any;
  caregiverDetailMap: any;
  searchConsole: any;
}

export const defaultCaregiverDetail = {
  SocialSecurityNum: null,
  personaldata: null,
  reminders: [],
  attachments: [],
  availabilities: [],
  languages: [],
  skills: [],
  notes: [],
  customfields: [],
  visits: null,
  contacts: null
};

export const initialState: State = {
  loading: false,
  saving: '',
  ids: [],
  entities: {},
  currentCaregiver: null,
  caregiverDetailMap: {
    currentCaregiverSocialSecurityNum: null
  },
  listPageInfo: {
    statusFilter: 'active',
    filter: {},
    sort: {}
  },
  searchConsole: {
    loading: false,
    allCaregivers: [], // Contains Social Security Num, Lat, Lng, Distance
    caregivers: [], // Main Data, Paginated
    pageInfo: {
      pageSize: 10,
      currentPage: 1
    },
    filterInfo: {
      filter: {},
      sort: {},
      clientId: ''
    }
  }
};
const nyTimezoneOffSet = 300;

function isSameDocument(idField, data1, data2, idData?) {
  const compareIdData = idData || data2;
  if (typeof idField === 'object') {
    let isNotSame = idField.some(f => data1[f] !== compareIdData[f]);
    return !isNotSame;
  } else if (typeof idField === 'string') {
    return data1[idField] === compareIdData[idField];
  }
  return false;
}

function setCaregiverDataForDetailMap(caregiverDetailMap, payload, extra = {}) {
  const {SocialSecurityNum} = payload;
  if (payload.personaldata) {
    payload.personaldata = cleanCaregiverData(payload.personaldata);
  }
  if (payload.notes) {
    payload.notes = cleanData(payload.notes, 'notes');
  }
  if (payload.reminders) {
    payload.reminders = cleanData(payload.reminders, 'reminders');
  }
  if (payload.visits) {
    payload.visits = cleanData(payload.visits, 'visits');
  }

  let detailMap = {...caregiverDetailMap, ...extra};
  let currentDetail = detailMap[SocialSecurityNum] || cloneDeep(defaultCaregiverDetail);
  if (payload.action && payload.target !== 'personaldata') {
    currentDetail = {...currentDetail};
    if (currentDetail[payload.target]) {
      if (
        payload.action === 'create' ||
        payload.action === 'update' ||
        payload.action === 'create-update'
      ) {
        payload.data = cleanSingleData(payload.data, payload.target);
      }
      if (payload.action === 'create') {
        currentDetail[payload.target] = [...currentDetail[payload.target], payload.data];
      } else if (payload.action === 'update') {
        currentDetail[payload.target] = currentDetail[payload.target].map(row =>
          isSameDocument(payload.idField, row, payload.data, payload.idData) ? payload.data : row
        );
      } else if (payload.action === 'delete') {
        currentDetail[payload.target] = currentDetail[payload.target].filter(
          row => !isSameDocument(payload.idField, row, payload.data)
        );
      } else if (payload.action === 'create-update') {
        let exists = false;
        currentDetail[payload.target] = currentDetail[payload.target].map(row => {
          if (isSameDocument(payload.idField, row, payload.data)) {
            exists = true;
            return payload.data;
          }
          return row;
        });
        if (!exists) {
          currentDetail[payload.target] = [...currentDetail[payload.target], payload.data];
        }
      }
    }
  } else {
    currentDetail = {...currentDetail, ...payload};
  }
  // if (payload.target && payload.target !== 'personaldata') {
  //   cleanData(currentDetail, payload.target);
  // }
  if (payload.target === 'all') {
  }
  detailMap[SocialSecurityNum] = currentDetail;
  return detailMap;
}

const updateEntities = (state, payload) => {
  if (state.ids.length === 0) {
    return {};
  }
  if (payload.target === 'personaldata') {
    let personaldata = cleanCaregiverData(payload.personaldata);
    if (payload.action === 'update') {
      return caregiverAdapter.updateOne(
        {
          id: payload.SocialSecurityNum,
          changes: personaldata
        },
        state
      );
    } else if (payload.action === 'create') {
      return caregiverAdapter.addOne(personaldata, state);
    }
  } else if (payload.customfields) {
    // if (payload.action === 'create-update') {
    return caregiverAdapter.updateOne(
      {
        id: payload.SocialSecurityNum,
        changes: payload.customfields.reduce((obj, cur) => {
          obj[cur.cfieldName] = cur.descr;
          return obj;
        }, {})
      },
      state
    );
    // }
  }
  return {};
};

function setCaregiverSocialSecurityNumForDetailMap(
  caregiverDetailMap,
  currentCaregiverSocialSecurityNum
) {
  let detailMap = {...caregiverDetailMap, currentCaregiverSocialSecurityNum};
  if (!detailMap[currentCaregiverSocialSecurityNum]) {
    detailMap[currentCaregiverSocialSecurityNum] = {
      SocialSecurityNum: currentCaregiverSocialSecurityNum
    };
  }
  return detailMap;
}

// Clean up birthday and etc
function cleanCaregiverData(caregiver) {
  let newCaregiver = {...caregiver};

  newCaregiver.CertExpirationDate = !newCaregiver.CertExpirationDate
    ? ''
    : newCaregiver.CertExpirationDate.substr(0, 10);
  newCaregiver.DateofBirth = !newCaregiver.DateofBirth
    ? ''
    : newCaregiver.DateofBirth.substr(0, 10);
  newCaregiver.InactiveDate = !newCaregiver.InactiveDate
    ? ''
    : newCaregiver.InactiveDate.substr(0, 10);
  newCaregiver.StatusDate = !newCaregiver.StatusDate ? '' : newCaregiver.StatusDate.substr(0, 10);

  if (newCaregiver.CertExpirationDate == '1900-01-01') {
    newCaregiver.CertExpirationDate = '';
  }
  if (newCaregiver.DateofBirth == '1900-01-01') {
    newCaregiver.DateofBirth = '';
  }
  if (newCaregiver.InactiveDate == '1900-01-01') {
    newCaregiver.InactiveDate = '';
  }
  if (newCaregiver.StatusDate == '1900-01-01') {
    newCaregiver.StatusDate = '';
  }

  return newCaregiver;
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

// function cleanData(currentDetail, target) {
//   if (currentDetail[target]) {
//     currentDetail[target].forEach(detail => {
//       if (target === 'reminders') {
//         detail.expirationDate = detail.expirationDate.substr(0, 10);
//       } else if (target === 'visits') {
//         detail.first_visit = detail.first_visit.substr(0, 10);
//         detail.last_visit = detail.last_visit.substr(0, 10);
//       } else if (target === 'notes') {
//         let temp = new Date(
//           detail.NoteDate.substring(0, 10) + ' ' + detail.NoteTime.substring(11, 19)
//         );
//         detail.dt = getLocal(temp, nyTimezoneOffSet);
//         detail.dt = new Date(detail.dt).toLocaleString('en-US', {
//           day: 'numeric',
//           month: 'numeric',
//           year: 'numeric',
//           hour: 'numeric',
//           minute: 'numeric',
//           hour12: true
//         });
//       }
//     });
//   }
// }

function cleanData(data, target) {
  // data.forEach(detail => {
  //   if (target === 'reminders') {
  //     detail.expirationDate = detail.expirationDate.substr(0, 10);
  //   } else if (target === 'visits') {
  //     detail.first_visit = detail.first_visit.substr(0, 10);
  //     detail.last_visit = detail.last_visit.substr(0, 10);
  //   } else if (target === 'notes') {
  //     let temp = new Date(
  //       detail.NoteDate.substring(0, 10) + ' ' + detail.NoteTime.substring(11, 19)
  //     );
  //     detail.dt = getLocal(temp, nyTimezoneOffSet);
  //     detail.dt = new Date(detail.dt).toLocaleString('en-US', {
  //       day: 'numeric',
  //       month: 'numeric',
  //       year: 'numeric',
  //       hour: 'numeric',
  //       minute: 'numeric',
  //       hour12: true
  //     });
  //   }
  // });
  data = data.map(detail => cleanSingleData(detail, target));
  return data;
}

function cleanSingleData(detail, target) {
  if (target === 'reminders') {
    detail.expirationDate = detail.expirationDate.substr(0, 10);
  } else if (target === 'visits') {
    detail.first_visit = detail.first_visit.substr(0, 10);
    detail.last_visit = detail.last_visit.substr(0, 10);
  } else if (target === 'notes') {
    const dateTime = detail.NoteDate.substring(0, 10) + ' ' + detail.NoteTime.substring(11, 19);
    const convertedTime = momentTz.tz(dateTime, 'America/New_York').toDate();
    detail.convertedTime = convertedTime;
    detail.dt = new Date(convertedTime).toLocaleString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    detail.dtSmallLength = moment(convertedTime).format('M/D/YY');
  }
  return detail;
}

function convertSearchData(caregivers) {
  let updatedCaregivers = caregivers.map(caregiver => {
    if (caregiver.first_visit) {
      caregiver.first_visit = caregiver.first_visit.substr(0, 10);
    }
    if (caregiver.notes) {
      caregiver.notes.forEach(detail => {
        const dateTime = detail.NoteDate.substring(0, 10) + ' ' + detail.NoteTime.substring(11, 19);
        const convertedTime = momentTz.tz(dateTime, 'America/New_York').toDate();
        detail.dt = new Date(convertedTime).toLocaleString('en-US', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        });
        detail.dtSmallLength = moment(convertedTime).format('M/D/YY');
      });
    }
    return cleanCaregiverData(caregiver);
  });
  return updatedCaregivers;
}

export function reducer(state = initialState, action: CaregiverActions): State {
  switch (action.type) {
    case CaregiverActionTypes.LoadCaregivers:
      return {...state, loading: true};
    case CaregiverActionTypes.LoadCaregiversSuccess:
      return {
        ...caregiverAdapter.addAll(
          action.payload.map(caregiver => cleanCaregiverData(caregiver)),
          state
        ),
        loading: false
      };
    case CaregiverActionTypes.LoadCaregiversFailure:
      return {...state, loading: false};
    case CaregiverActionTypes.SetCaregiverListPageInfo:
      return {...state, listPageInfo: {...state.listPageInfo, ...action.payload}};
    case CaregiverActionTypes.LoadSingleCaregiver:
    case CaregiverActionTypes.LoadCaregiverAttachments:
    case CaregiverActionTypes.LoadCaregiverContacts:
    case CaregiverActionTypes.LoadCaregiverCustomFields:
    case CaregiverActionTypes.LoadCaregiverNotes:
    case CaregiverActionTypes.LoadCaregiverReminders:
    case CaregiverActionTypes.LoadCaregiverVisits:
      return {...state, loading: true};
    case CaregiverActionTypes.LoadSingleCaregiverSuccess:
    case CaregiverActionTypes.LoadCaregiverAttachmentsSuccess:
    case CaregiverActionTypes.LoadCaregiverContactsSuccess:
    case CaregiverActionTypes.LoadCaregiverCustomFieldsSuccess:
    case CaregiverActionTypes.LoadCaregiverNotesSuccess:
    case CaregiverActionTypes.LoadCaregiverRemindersSuccess:
    case CaregiverActionTypes.LoadCaregiverVisitsSuccess:
      return {
        ...state,
        loading: false,
        caregiverDetailMap: setCaregiverDataForDetailMap(state.caregiverDetailMap, action.payload)
      };
    case CaregiverActionTypes.LoadSingleCaregiverFailure:
    case CaregiverActionTypes.LoadCaregiverAttachmentsFailure:
    case CaregiverActionTypes.LoadCaregiverContactsFailure:
    case CaregiverActionTypes.LoadCaregiverCustomFieldsFailure:
    case CaregiverActionTypes.LoadCaregiverNotesFailure:
    case CaregiverActionTypes.LoadCaregiverRemindersFailure:
    case CaregiverActionTypes.LoadCaregiverVisitsFailure:
      return {...state, loading: false};
    case CaregiverActionTypes.CreateSingleCaregiver:
    case CaregiverActionTypes.UpdateSingleCaregiver:
    case CaregiverActionTypes.CreateCaregiverReminders:
    case CaregiverActionTypes.UpdateCaregiverReminders:
    case CaregiverActionTypes.DeleteCaregiverReminders:
    case CaregiverActionTypes.CreateCaregiverAttachments:
    case CaregiverActionTypes.UpdateCaregiverAttachments:
    case CaregiverActionTypes.DeleteCaregiverAttachments:
    case CaregiverActionTypes.CreateCaregiverContacts:
    case CaregiverActionTypes.UpdateCaregiverContacts:
    case CaregiverActionTypes.DeleteCaregiverContacts:
    case CaregiverActionTypes.CreateCaregiverNotes:
    case CaregiverActionTypes.UpdateCaregiverNotes:
    case CaregiverActionTypes.DeleteCaregiverNotes:
    case CaregiverActionTypes.UpdateCaregiverCustomFields:
    case CaregiverActionTypes.UpdateCaregiverCustomFieldsAll:
    case CaregiverActionTypes.UpdateCaregiverLanguages:
    case CaregiverActionTypes.UpdateCaregiverSkills:
    case CaregiverActionTypes.UpdateCaregiverAvailabilities:
      return {...state, saving: 'saving'};
    case CaregiverActionTypes.UpdateSingleCaregiverSuccess:
    case CaregiverActionTypes.UpdateCaregiverCustomFieldsSuccess:
    case CaregiverActionTypes.UpdateCaregiverCustomFieldsAllSuccess:
    case CaregiverActionTypes.CreateSingleCaregiverSuccess:
      return {
        ...state,
        ...updateEntities(state, action.payload),
        caregiverDetailMap: setCaregiverDataForDetailMap(state.caregiverDetailMap, action.payload),
        saving: 'success'
      };
    case CaregiverActionTypes.CreateCaregiverRemindersSuccess:
    case CaregiverActionTypes.UpdateCaregiverRemindersSuccess:
    case CaregiverActionTypes.DeleteCaregiverRemindersSuccess:
    case CaregiverActionTypes.CreateCaregiverAttachmentsSuccess:
    case CaregiverActionTypes.UpdateCaregiverAttachmentsSuccess:
    case CaregiverActionTypes.DeleteCaregiverAttachmentsSuccess:
    case CaregiverActionTypes.CreateCaregiverContactsSuccess:
    case CaregiverActionTypes.UpdateCaregiverContactsSuccess:
    case CaregiverActionTypes.DeleteCaregiverContactsSuccess:
    case CaregiverActionTypes.CreateCaregiverNotesSuccess:
    case CaregiverActionTypes.UpdateCaregiverNotesSuccess:
    case CaregiverActionTypes.DeleteCaregiverNotesSuccess:
    case CaregiverActionTypes.UpdateCaregiverLanguagesSuccess:
    case CaregiverActionTypes.UpdateCaregiverSkillsSuccess:
    case CaregiverActionTypes.UpdateCaregiverAvailabilitiesSuccess:
      return {
        ...state,
        saving: 'success',
        caregiverDetailMap: setCaregiverDataForDetailMap(state.caregiverDetailMap, action.payload)
      };
    case CaregiverActionTypes.CreateSingleCaregiverFailure:
    case CaregiverActionTypes.UpdateSingleCaregiverFailure:
    case CaregiverActionTypes.UpdateCaregiverRemindersFailure:
    case CaregiverActionTypes.CreateCaregiverRemindersFailure:
    case CaregiverActionTypes.DeleteCaregiverRemindersFailure:
    case CaregiverActionTypes.CreateCaregiverAttachmentsFailure:
    case CaregiverActionTypes.UpdateCaregiverAttachmentsFailure:
    case CaregiverActionTypes.DeleteCaregiverAttachmentsFailure:
    case CaregiverActionTypes.CreateCaregiverContactsFailure:
    case CaregiverActionTypes.UpdateCaregiverContactsFailure:
    case CaregiverActionTypes.DeleteCaregiverContactsFailure:
    case CaregiverActionTypes.CreateCaregiverNotesFailure:
    case CaregiverActionTypes.UpdateCaregiverNotesFailure:
    case CaregiverActionTypes.DeleteCaregiverNotesFailure:
    case CaregiverActionTypes.UpdateCaregiverCustomFieldsFailure:
    case CaregiverActionTypes.UpdateCaregiverCustomFieldsAllFailure:
    case CaregiverActionTypes.UpdateCaregiverLanguagesFailure:
    case CaregiverActionTypes.UpdateCaregiverSkillsFailure:
    case CaregiverActionTypes.UpdateCaregiverAvailabilitiesFailure:
      return {...state, saving: 'error'};

    case CaregiverActionTypes.SetCurrentCaregiverSocialSecurityNum:
      return {
        ...state,
        loading: false,
        caregiverDetailMap: setCaregiverSocialSecurityNumForDetailMap(
          state.caregiverDetailMap,
          action.payload
        )
      };
    case CaregiverActionTypes.SearchCaregivers:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          loading: true,
          allCaregivers: [],
          caregivers: [],
          pageInfo: pick(action.payload, ['currentPage', 'pageSize']),
          filterInfo: omit(action.payload, ['currentPage', 'pageSize'])
        }
      };
    case CaregiverActionTypes.SearchCaregiversSuccess:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          loading: false,
          caregivers: convertSearchData(action.payload.caregivers),
          allCaregivers: action.payload.allCaregivers
        }
      };
    case CaregiverActionTypes.SearchCaregiversFailure:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          loading: false
        }
      };
    case CaregiverActionTypes.SearchCaregiversReset:
      return {
        ...state,
        searchConsole: {
          loading: false,
          allCaregivers: [], // Contains Social Security Num, Lat, Lng, Distance
          caregivers: [], // Main Data, Paginated
          pageInfo: {
            pageSize: 10,
            currentPage: 1
          },
          filterInfo: {
            filter: {},
            sort: {},
            clientId: ''
          }
        }
      };
    case CaregiverActionTypes.GetSearchCaregiversPageForRemove:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          allCaregivers: action.payload.allCaregivers,
          caregivers: action.payload.caregivers
        }
      };
    case CaregiverActionTypes.GetSearchCaregiversPageForRemoveSuccess:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          caregivers: [
            ...state.searchConsole.caregivers,
            ...convertSearchData(action.payload.caregivers)
          ]
        }
      };
    case CaregiverActionTypes.SetCaregiverSearchPageInfo:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          pageInfo: action.payload.pageInfo
        }
      };
    case CaregiverActionTypes.GetSearchCaregiversPage:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          loading: true,
          pageInfo: action.payload.pageInfo
        }
      };
    case CaregiverActionTypes.GetSearchCaregiversPageSuccess:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          loading: false,
          caregivers: convertSearchData(action.payload.caregivers)
        }
      };
    case CaregiverActionTypes.GetSearchCaregiversPageFailure:
      return {
        ...state,
        searchConsole: {
          ...state.searchConsole,
          loading: false
        }
      };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
// export const getCaregivers = (state: State) => state.caregivers;
export const getListPageInfo = (state: State) => state.listPageInfo;
export const getCurrentCaregiver = (state: State) => state.currentCaregiver;
export const getCaregiverDetailMap = (state: State) => state.caregiverDetailMap;
export const getSearchConsole = (state: State) => state.searchConsole;
export const {selectIds, selectEntities, selectAll, selectTotal} = caregiverAdapter.getSelectors();
