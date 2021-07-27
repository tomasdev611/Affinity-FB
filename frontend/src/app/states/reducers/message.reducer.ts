// import { Message } from '../../core/models';
import * as moment from 'moment';
import {omit, pick} from 'lodash';
import {MessageActions, MessageActionTypes} from '../actions/message.actions';

// const DEFAULT_CAREGIVER_
export interface State {
  loading: boolean;
  saving: string;
  messages: any;
  SocialSecurityNum: string;
  groupInfo: any;
  chatroomInfo: any;
  unreads: any;
}

export const initialState: State = {
  loading: false,
  saving: '',
  messages: [],
  SocialSecurityNum: '',
  groupInfo: {
    groupLoaded: false,
    groups: [],
    loading: false,
    group: null,
    saving: ''
  },
  chatroomInfo: {
    list: [],
    loaded: false,
    loading: false,
    totalCount: 0,
    pageInfo: {
      pageSize: 10,
      currentPage: 1
    },
    filterInfo: {
      filter: {},
      sort: {},
      securityUserName: ''
    }
  },
  unreads: {
    loading: false,
    totalUnreadCount: 0,
    chatrooms: []
  }
};

export function reducer(state = initialState, action: MessageActions): State {
  switch (action.type) {
    case MessageActionTypes.LoadMessages:
      return {...state, loading: true};
    case MessageActionTypes.LoadMessagesSuccess:
      return {
        ...state,
        messages: action.payload,
        loading: false
      };
    case MessageActionTypes.LoadMessagesFailure:
      return {...state, loading: false};
    case MessageActionTypes.SendMessage:
      return {...state, saving: 'saving'};
    case MessageActionTypes.SendMessageSuccess:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        saving: 'success'
      };
    case MessageActionTypes.SendMessageFailure:
      return {...state, saving: 'error'};

    case MessageActionTypes.LoadMessageGroups:
    case MessageActionTypes.LoadMessageSingleGroup:
      return {...state, groupInfo: {...state.groupInfo, loading: true}};
    case MessageActionTypes.LoadMessageGroupsFailure:
      return {...state, groupInfo: {...state.groupInfo, loading: false, groupLoaded: true}};
    case MessageActionTypes.LoadMessageSingleGroupFailure:
      return {...state, groupInfo: {...state.groupInfo, loading: false}};
    case MessageActionTypes.LoadMessageGroupsSuccess:
      return {
        ...state,
        groupInfo: {
          ...state.groupInfo,
          loading: false,
          groups: action.payload.groups,
          groupLoaded: true
        }
      };
    case MessageActionTypes.LoadMessageSingleGroupSuccess:
      return {
        ...state,
        groupInfo: {
          ...state.groupInfo,
          loading: false,
          groups: state.groupInfo.groups.map(g => {
            if (g.GroupId === action.payload.GroupId) {
              return action.payload.group;
            } else {
              return g;
            }
          })
        }
      };
    case MessageActionTypes.CreateMessageGroup:
    case MessageActionTypes.UpdateMessageGroup:
    case MessageActionTypes.DeleteMessageGroup:
      return {...state, groupInfo: {...state.groupInfo, saving: 'saving'}};
    case MessageActionTypes.CreateMessageGroupFailure:
    case MessageActionTypes.UpdateMessageGroupFailure:
    case MessageActionTypes.DeleteMessageGroupFailure:
      return {...state, groupInfo: {...state.groupInfo, saving: 'error'}};
    case MessageActionTypes.CreateMessageGroupSuccess:
      return {
        ...state,
        groupInfo: {
          ...state.groupInfo,
          saving: 'success',
          groups: [...state.groupInfo.groups, action.payload.group]
        }
      };
    case MessageActionTypes.UpdateMessageGroupSuccess:
      return {
        ...state,
        groupInfo: {
          ...state.groupInfo,
          saving: 'success',
          groups: state.groupInfo.groups.map(g => {
            if (g.GroupId === action.payload.GroupId) {
              return action.payload.group;
            } else {
              return g;
            }
          })
        }
      };
    case MessageActionTypes.DeleteMessageGroupSuccess:
      return {
        ...state,
        groupInfo: {
          ...state.groupInfo,
          saving: 'success',
          groups: state.groupInfo.groups.filter(g => g.GroupId !== action.payload.GroupId)
        }
      };
    case MessageActionTypes.LoadChatRooms:
      return {
        ...state,
        chatroomInfo: {
          ...state.chatroomInfo,
          loading: true,
          pageInfo: pick(action.payload, ['currentPage', 'pageSize']),
          filterInfo: omit(action.payload, ['currentPage', 'pageSize'])
        }
      };
    case MessageActionTypes.LoadChatRoomsFailure:
      return {
        ...state,
        chatroomInfo: {
          ...state.chatroomInfo,
          loaded: true,
          loading: false
        }
      };
    case MessageActionTypes.LoadChatRoomsSuccess:
      return {
        ...state,
        chatroomInfo: {
          ...state.chatroomInfo,
          list: action.payload.chatrooms,
          totalCount:
            action.payload.currentPage === 1
              ? action.payload.totalCount
              : state.chatroomInfo.totalCount,
          loaded: true,
          loading: false
        }
      };
    case MessageActionTypes.LoadUnreadsCount:
      return {
        ...state,
        unreads: {
          ...state.unreads,
          loading: true
        }
      };
    case MessageActionTypes.LoadUnreadsCountFailure:
      return {
        ...state,
        unreads: {
          ...state.unreads,
          loading: false
        }
      };
    case MessageActionTypes.LoadUnreadsCountSuccess:
      return {
        ...state,
        unreads: {
          ...state.unreads,
          ...action.payload,
          loading: false
        }
      };
    default:
      return state;
  }
}

// export const getLoading = (state: State) => state.loading;
// export const getSaving = (state: State) => state.saving;
// export const getMessages = (state: State) => state.messages;
// export const getMessageInfo = (state: State) => state;
export const getMessageGroupInfo = (state: State) => state.groupInfo;
export const getChatRoomInfo = (state: State) => state.chatroomInfo;
export const getUnreadsInfo = (state: State) => state.unreads;
