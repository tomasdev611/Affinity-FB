import {ComplianceActions, ComplianceActionTypes} from '../actions/compliance.actions';

export interface State {
  loading: boolean;
  saving: string;
  clientCompliances: any;
  clientListPageInfo: any;
  caregiverCompliances: any;
  caregiverListPageInfo: any;
  caregiverContacts: any;
  clientContacts: any;
}

export const initialState: State = {
  loading: false,
  saving: '',
  clientCompliances: [],
  clientListPageInfo: {
    statusFilter: 'A',
    reminderMode: 'A',
    filter: {},
    sort: {}
  },
  caregiverCompliances: [],
  caregiverListPageInfo: {
    statusFilter: 'A',
    reminderMode: 'A',
    filter: {},
    sort: {}
  },
  caregiverContacts: {
    caregiver: null,
    contacts: [],
    pageInfo: {
      statusFilter: 'A',
      reminderMode: 'A',
      filter: {},
      sort: {}
    }
  },
  clientContacts: {
    client: null,
    contacts: [],
    pageInfo: {
      statusFilter: 'A',
      reminderMode: 'A',
      filter: {},
      sort: {}
    }
  }
};

export function reducer(state = initialState, action: ComplianceActions): State {
  switch (action.type) {
    case ComplianceActionTypes.LoadClientCompliances:
    case ComplianceActionTypes.LoadCaregiverCompliances:
      return {...state, loading: true};
    case ComplianceActionTypes.LoadCaregiverContacts:
      return {
        ...state,
        loading: true,
        caregiverContacts: {
          ...state.caregiverContacts,
          caregiver: action.payload.SocialSecurityNum,
          contacts: [],
          pageInfo: {...state.caregiverContacts.pageInfo, currentPage: 0}
        }
      };
    case ComplianceActionTypes.LoadClientContacts:
      return {
        ...state,
        loading: true,
        clientContacts: {
          ...state.clientContacts,
          client: action.payload.ClientId,
          contacts: [],
          pageInfo: {...state.clientContacts.pageInfo, currentPage: 0}
        }
      };
    case ComplianceActionTypes.LoadClientCompliancesSuccess:
      return {
        ...state,
        clientCompliances: action.payload,
        loading: false
      };
    case ComplianceActionTypes.LoadCaregiverCompliancesSuccess:
      return {
        ...state,
        caregiverCompliances: action.payload,
        loading: false
      };
    case ComplianceActionTypes.LoadCaregiverContactsSuccess:
      return {
        ...state,
        caregiverContacts: {
          ...state.caregiverContacts,
          contacts: action.payload
        },
        loading: false
      };
    case ComplianceActionTypes.LoadClientContactsSuccess:
      return {
        ...state,
        clientContacts: {
          ...state.clientContacts,
          contacts: action.payload
        },
        loading: false
      };
    case ComplianceActionTypes.LoadClientCompliancesFailure:
    case ComplianceActionTypes.LoadCaregiverCompliancesFailure:
    case ComplianceActionTypes.LoadCaregiverContactsFailure:
    case ComplianceActionTypes.LoadClientContactsFailure:
      return {...state, loading: false};
    case ComplianceActionTypes.SetClientComplianceListPageInfo:
      return {...state, clientListPageInfo: {...state.clientListPageInfo, ...action.payload}};
    case ComplianceActionTypes.SetCaregiverComplianceListPageInfo:
      return {...state, caregiverListPageInfo: {...state.caregiverListPageInfo, ...action.payload}};
    case ComplianceActionTypes.SetCaregiverContactsPageInfo:
      return {
        ...state,
        caregiverContacts: {
          ...state.caregiverContacts,
          pageInfo: {...state.caregiverContacts.pageInfo, ...action.payload}
        }
      };
    case ComplianceActionTypes.SetClientContactsPageInfo:
      return {
        ...state,
        clientContacts: {
          ...state.clientContacts,
          pageInfo: {...state.clientContacts.pageInfo, ...action.payload}
        }
      };
    default:
      return state;
  }
}

export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
// export const getCompliances = (state: State) => state.compliances;
export const getClientListPageInfo = (state: State) => state.clientListPageInfo;
export const getReportsClientCompliances = (state: State) => state.clientCompliances;
export const getCaregiverListPageInfo = (state: State) => state.caregiverListPageInfo;
export const getReportsCaregiverCompliances = (state: State) => state.caregiverCompliances;
export const getCaregiverContacts = (state: State) => state.caregiverContacts;
export const getClientContacts = (state: State) => state.clientContacts;
