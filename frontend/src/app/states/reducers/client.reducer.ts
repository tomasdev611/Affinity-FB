// import { Client } from '../../core/models';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';
import {EntityState, createEntityAdapter} from '@ngrx/entity';
import {ClientActions, ClientActionTypes} from '../actions/client.actions';

export function selectClientId(a: any): string {
  //In this case this would be optional since primary key is id
  return a.ClientId;
}

const clientAdapter = createEntityAdapter<any>({selectId: selectClientId});

export interface State extends EntityState<any> {
  loading: boolean;
  saving: string;
  currentClient: any;
  listPageInfo: any;
  clientDetailMap: any;
}

export const defaultClientDetail = {
  ClientId: null,
  personaldata: null,
  reminders: null,
  attachments: null,
  visits: null,
  notes: null,
  customfields: null,
  contacts: null,
  availabilities: [],
  languages: [],
  skills: []
};

export const initialState: State = {
  loading: false,
  saving: '',
  ids: [],
  entities: {},
  currentClient: null,
  clientDetailMap: {
    currentClientId: null
  },
  listPageInfo: {
    statusFilter: 'active',
    filter: {},
    sort: {}
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

function setClientDataForDetailMap(clientDetailMap, payload, extra = {}) {
  const {ClientId} = payload;
  if (payload.personaldata) {
    payload.personaldata = cleanClientData(payload.personaldata);
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

  let detailMap = {...clientDetailMap, ...extra};
  let currentDetail = detailMap[ClientId] || {};
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
  detailMap[ClientId] = currentDetail;
  return detailMap;
}

const updateEntities = (state, payload) => {
  if (state.ids.length === 0) {
    return {};
  }
  if (payload.target === 'personaldata') {
    let personaldata = cleanClientData(payload.personaldata);
    if (payload.action === 'update') {
      return clientAdapter.updateOne(
        {
          id: payload.ClientId,
          changes: personaldata
        },
        state
      );
    } else if (payload.action === 'create') {
      return clientAdapter.addOne(personaldata, state);
    }
  } else if (payload.target === 'customfields') {
    if (payload.action === 'create-update') {
      return clientAdapter.updateOne(
        {
          id: payload.ClientId,
          changes: {
            [payload.data.cfieldName]: payload.data.descr
          }
        },
        state
      );
    }
  }
  return {};
};

function setClientIDForDetailMap(clientDetailMap, currentClientId) {
  let detailMap = {...clientDetailMap, currentClientId};
  if (!detailMap[currentClientId]) {
    detailMap[currentClientId] = {ClientId: currentClientId};
  }
  return detailMap;
}

// Clean up birthday and etc
function cleanClientData(client) {
  let newClient = {...client};
  if (newClient.DateOfBirth) {
    newClient.DateOfBirth = newClient.DateOfBirth.substr(0, 10);
  }
  if (newClient.ServiceStartDate) {
    newClient.ServiceStartDate = newClient.ServiceStartDate.substr(0, 10);
  }
  if (newClient.ServiceEndDate) {
    newClient.ServiceEndDate = newClient.ServiceEndDate.substr(0, 10);
  }
  if (newClient.ServiceEndDate == '1900-01-01') {
    newClient.ServiceEndDate = '';
  }
  if (newClient.ServiceStartDate == '1900-01-01') {
    newClient.ServiceStartDate = '';
  }
  if (newClient.DateOfBirth == '1900-01-01') {
    newClient.DateOfBirth = '';
  }
  return newClient;
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

function cleanData(data, target) {
  // if (currentDetail[target]) {
  //   currentDetail[target].forEach(detail => {
  //     if (target === 'reminders') {
  //       detail.expirationDate = detail.expirationDate.substr(0, 10);
  //     } else if (target === 'visits') {
  //       detail.first_visit = detail.first_visit.substr(0, 10);
  //       detail.last_visit = detail.last_visit.substr(0, 10);
  //     } else if (target === 'notes') {
  //       let temp = new Date(
  //         detail.NoteDate.substring(0, 10) + ' ' + detail.NoteTime.substring(11, 19)
  //       );
  //       detail.dt = getLocal(temp, nyTimezoneOffSet);
  //       detail.dt = new Date(detail.dt).toLocaleString('en-US', {
  //         day: 'numeric',
  //         month: 'numeric',
  //         year: 'numeric',
  //         hour: 'numeric',
  //         minute: 'numeric',
  //         hour12: true
  //       });

  //       detail.dtSmallLength = moment(detail.NoteDate).format('D/M/YY');
  //     }
  //   });
  // }
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

export function reducer(state = initialState, action: ClientActions): State {
  switch (action.type) {
    case ClientActionTypes.LoadClients:
      return {...state, loading: true};
    case ClientActionTypes.LoadClientsSuccess:
      return {
        ...clientAdapter.addAll(action.payload.map(client => cleanClientData(client)), state),
        loading: false
      };
    case ClientActionTypes.LoadClientsFailure:
      return {...state, loading: false};
    case ClientActionTypes.SetClientListPageInfo:
      return {...state, listPageInfo: {...state.listPageInfo, ...action.payload}};
    case ClientActionTypes.LoadSingleClient:
    case ClientActionTypes.LoadClientAttachments:
    case ClientActionTypes.LoadClientContacts:
    case ClientActionTypes.LoadClientCustomFields:
    case ClientActionTypes.LoadClientNotes:
    case ClientActionTypes.LoadClientReminders:
    case ClientActionTypes.LoadClientVisits:
      return {...state, loading: true};
    case ClientActionTypes.LoadSingleClientSuccess:
    case ClientActionTypes.LoadClientAttachmentsSuccess:
    case ClientActionTypes.LoadClientContactsSuccess:
    case ClientActionTypes.LoadClientCustomFieldsSuccess:
    case ClientActionTypes.LoadClientNotesSuccess:
    case ClientActionTypes.LoadClientRemindersSuccess:
    case ClientActionTypes.LoadClientVisitsSuccess:
      return {
        ...state,
        loading: false,
        clientDetailMap: setClientDataForDetailMap(state.clientDetailMap, action.payload)
      };
    case ClientActionTypes.LoadSingleClientFailure:
    case ClientActionTypes.LoadClientAttachmentsFailure:
    case ClientActionTypes.LoadClientContactsFailure:
    case ClientActionTypes.LoadClientCustomFieldsFailure:
    case ClientActionTypes.LoadClientNotesFailure:
    case ClientActionTypes.LoadClientRemindersFailure:
    case ClientActionTypes.LoadClientVisitsFailure:
      return {...state, loading: false};
    case ClientActionTypes.CreateSingleClient:
    case ClientActionTypes.UpdateSingleClient:
    case ClientActionTypes.CreateClientReminders:
    case ClientActionTypes.UpdateClientReminders:
    case ClientActionTypes.DeleteClientReminders:
    case ClientActionTypes.CreateClientAttachments:
    case ClientActionTypes.UpdateClientAttachments:
    case ClientActionTypes.DeleteClientAttachments:
    case ClientActionTypes.CreateClientContacts:
    case ClientActionTypes.UpdateClientContacts:
    case ClientActionTypes.DeleteClientContacts:
    case ClientActionTypes.CreateClientNotes:
    case ClientActionTypes.UpdateClientNotes:
    case ClientActionTypes.DeleteClientNotes:
    case ClientActionTypes.UpdateClientCustomFields:
    case ClientActionTypes.UpdateClientCustomFieldsAll:
    case ClientActionTypes.UpdateClientLanguages:
    case ClientActionTypes.UpdateClientSkills:
    case ClientActionTypes.UpdateClientAvailabilities:
      return {...state, saving: 'saving'};
    case ClientActionTypes.CreateSingleClientSuccess:
    case ClientActionTypes.UpdateSingleClientSuccess:
    case ClientActionTypes.UpdateClientCustomFieldsSuccess:
    case ClientActionTypes.UpdateClientCustomFieldsAllSuccess:
      return {
        ...state,
        ...updateEntities(state, action.payload),
        clientDetailMap: setClientDataForDetailMap(state.clientDetailMap, action.payload),
        saving: 'success'
      };
    case ClientActionTypes.CreateClientRemindersSuccess:
    case ClientActionTypes.UpdateClientRemindersSuccess:
    case ClientActionTypes.DeleteClientRemindersSuccess:
    case ClientActionTypes.CreateClientAttachmentsSuccess:
    case ClientActionTypes.UpdateClientAttachmentsSuccess:
    case ClientActionTypes.DeleteClientAttachmentsSuccess:
    case ClientActionTypes.CreateClientContactsSuccess:
    case ClientActionTypes.UpdateClientContactsSuccess:
    case ClientActionTypes.DeleteClientContactsSuccess:
    case ClientActionTypes.CreateClientNotesSuccess:
    case ClientActionTypes.UpdateClientNotesSuccess:
    case ClientActionTypes.DeleteClientNotesSuccess:
    case ClientActionTypes.UpdateClientLanguagesSuccess:
    case ClientActionTypes.UpdateClientSkillsSuccess:
    case ClientActionTypes.UpdateClientAvailabilitiesSuccess:
      return {
        ...state,
        saving: 'success',
        clientDetailMap: setClientDataForDetailMap(state.clientDetailMap, action.payload)
      };
    case ClientActionTypes.CreateSingleClientFailure:
    case ClientActionTypes.UpdateSingleClientFailure:
    case ClientActionTypes.UpdateClientRemindersFailure:
    case ClientActionTypes.CreateClientRemindersFailure:
    case ClientActionTypes.DeleteClientRemindersFailure:
    case ClientActionTypes.CreateClientAttachmentsFailure:
    case ClientActionTypes.UpdateClientAttachmentsFailure:
    case ClientActionTypes.DeleteClientAttachmentsFailure:
    case ClientActionTypes.CreateClientContactsFailure:
    case ClientActionTypes.UpdateClientContactsFailure:
    case ClientActionTypes.DeleteClientContactsFailure:
    case ClientActionTypes.CreateClientNotesFailure:
    case ClientActionTypes.UpdateClientNotesFailure:
    case ClientActionTypes.DeleteClientNotesFailure:
    case ClientActionTypes.UpdateClientCustomFieldsFailure:
    case ClientActionTypes.UpdateClientCustomFieldsAllFailure:
    case ClientActionTypes.UpdateClientLanguagesFailure:
    case ClientActionTypes.UpdateClientSkillsFailure:
    case ClientActionTypes.UpdateClientAvailabilitiesFailure:
      return {...state, saving: 'error'};

    case ClientActionTypes.SetCurrentClientID:
      return {
        ...state,
        loading: false,
        clientDetailMap: setClientIDForDetailMap(state.clientDetailMap, action.payload)
      };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
// export const getClients = (state: State) => state.clients;
export const getListPageInfo = (state: State) => state.listPageInfo;
export const getCurrentClient = (state: State) => state.currentClient;
export const getClientDetailMap = (state: State) => state.clientDetailMap;
export const {selectIds, selectEntities, selectAll, selectTotal} = clientAdapter.getSelectors();
