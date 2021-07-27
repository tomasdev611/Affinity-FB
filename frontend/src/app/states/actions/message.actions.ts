import {Action} from '@ngrx/store';

export enum MessageActionTypes {
  // Messages associated with user
  LoadMessages = '[Message] Load Messages',
  LoadMessagesSuccess = '[Message] Load Messages Success',
  LoadMessagesFailure = '[Message] Load Messages Failure',
  SetMessageListPageInfo = '[Message] Set Message Page Info',

  SendMessage = '[Message] Create Single Message',
  SendMessageSuccess = '[Message] Create Single Message Success',
  SendMessageFailure = '[Message] Create Single Message Failure',

  LoadMessageGroups = '[Message] Load MessageGroups',
  LoadMessageGroupsSuccess = '[Message] Load MessageGroups Success',
  LoadMessageGroupsFailure = '[Message] Load MessageGroups Failure',

  LoadMessageSingleGroup = '[Message] Load Message SingleGroup',
  LoadMessageSingleGroupSuccess = '[Message] Load Message SingleGroup Success',
  LoadMessageSingleGroupFailure = '[Message] Load Message SingleGroup Failure',

  CreateMessageGroup = '[Message] Create MessageGroup',
  CreateMessageGroupSuccess = '[Message] Create MessageGroup Success',
  CreateMessageGroupFailure = '[Message] Create MessageGroup Failure',

  UpdateMessageGroup = '[Message] Update MessageGroup',
  UpdateMessageGroupSuccess = '[Message] Update MessageGroup Success',
  UpdateMessageGroupFailure = '[Message] Update MessageGroup Failure',

  DeleteMessageGroup = '[Message] Delete MessageGroup',
  DeleteMessageGroupSuccess = '[Message] Delete MessageGroup Success',
  DeleteMessageGroupFailure = '[Message] Delete MessageGroup Failure',

  SetCurrentMessageSocialSecurityNum = '[Message] Set Current Message SocialSecurityNum',

  LoadChatRooms = '[Message] Load ChatRooms',
  LoadChatRoomsSuccess = '[Message] Load ChatRooms Success',
  LoadChatRoomsFailure = '[Message] Load ChatRooms Failure',

  LoadUnreadsCount = '[Message] Load UnreadsCount',
  LoadUnreadsCountSuccess = '[Message] Load UnreadsCount Success',
  LoadUnreadsCountFailure = '[Message] Load UnreadsCount Failure'
}

export class LoadMessages implements Action {
  readonly type = MessageActionTypes.LoadMessages;
  constructor(public payload: any) {}
}

export class LoadMessagesSuccess implements Action {
  readonly type = MessageActionTypes.LoadMessagesSuccess;
  constructor(public payload: any[]) {}
}

export class LoadMessagesFailure implements Action {
  readonly type = MessageActionTypes.LoadMessagesFailure;
}

export class SetMessageListPageInfo implements Action {
  readonly type = MessageActionTypes.SetMessageListPageInfo;
  constructor(public payload: any) {}
}

export class SetCurrentMessageSocialSecurityNum implements Action {
  readonly type = MessageActionTypes.SetCurrentMessageSocialSecurityNum;
  constructor(public payload: any) {}
}

export class SendMessage implements Action {
  readonly type = MessageActionTypes.SendMessage;
  constructor(public payload: any) {}
}

export class SendMessageSuccess implements Action {
  readonly type = MessageActionTypes.SendMessageSuccess;
  constructor(public payload: any) {}
}

export class SendMessageFailure implements Action {
  readonly type = MessageActionTypes.SendMessageFailure;
}

export class LoadMessageGroups implements Action {
  readonly type = MessageActionTypes.LoadMessageGroups;
  // constructor(public payload: User) {}
}

export class LoadMessageGroupsSuccess implements Action {
  readonly type = MessageActionTypes.LoadMessageGroupsSuccess;
  constructor(public payload: any) {}
}
export class LoadMessageGroupsFailure implements Action {
  readonly type = MessageActionTypes.LoadMessageGroupsFailure;
}

export class LoadMessageSingleGroup implements Action {
  readonly type = MessageActionTypes.LoadMessageSingleGroup;
  // constructor(public payload: User) {}
}

export class LoadMessageSingleGroupSuccess implements Action {
  readonly type = MessageActionTypes.LoadMessageSingleGroupSuccess;
  constructor(public payload: any) {}
}
export class LoadMessageSingleGroupFailure implements Action {
  readonly type = MessageActionTypes.LoadMessageSingleGroupFailure;
}

export class CreateMessageGroup implements Action {
  readonly type = MessageActionTypes.CreateMessageGroup;
  constructor(public payload: any) {}
}

export class CreateMessageGroupSuccess implements Action {
  readonly type = MessageActionTypes.CreateMessageGroupSuccess;
  constructor(public payload: any) {}
}

export class CreateMessageGroupFailure implements Action {
  readonly type = MessageActionTypes.CreateMessageGroupFailure;
}

export class UpdateMessageGroup implements Action {
  readonly type = MessageActionTypes.UpdateMessageGroup;
  constructor(public payload: any) {}
}

export class UpdateMessageGroupSuccess implements Action {
  readonly type = MessageActionTypes.UpdateMessageGroupSuccess;
  constructor(public payload: any) {}
}

export class UpdateMessageGroupFailure implements Action {
  readonly type = MessageActionTypes.UpdateMessageGroupFailure;
}

export class DeleteMessageGroup implements Action {
  readonly type = MessageActionTypes.DeleteMessageGroup;
  constructor(public payload: any) {}
}

export class DeleteMessageGroupSuccess implements Action {
  readonly type = MessageActionTypes.DeleteMessageGroupSuccess;
  constructor(public payload: any) {}
}

export class DeleteMessageGroupFailure implements Action {
  readonly type = MessageActionTypes.DeleteMessageGroupFailure;
}

export class LoadChatRooms implements Action {
  readonly type = MessageActionTypes.LoadChatRooms;
  constructor(public payload: any) {}
}

export class LoadChatRoomsSuccess implements Action {
  readonly type = MessageActionTypes.LoadChatRoomsSuccess;
  constructor(public payload: any) {}
}

export class LoadChatRoomsFailure implements Action {
  readonly type = MessageActionTypes.LoadChatRoomsFailure;
}

export class LoadUnreadsCount implements Action {
  readonly type = MessageActionTypes.LoadUnreadsCount;
  constructor(public payload: any) {}
}

export class LoadUnreadsCountSuccess implements Action {
  readonly type = MessageActionTypes.LoadUnreadsCountSuccess;
  constructor(public payload: any) {}
}

export class LoadUnreadsCountFailure implements Action {
  readonly type = MessageActionTypes.LoadUnreadsCountFailure;
}

export type MessageActions =
  | LoadMessages
  | LoadMessagesSuccess
  | LoadMessagesFailure
  | SetMessageListPageInfo
  | SendMessage
  | SendMessageFailure
  | SendMessageSuccess
  | LoadMessageGroups
  | LoadMessageGroupsSuccess
  | LoadMessageGroupsFailure
  | LoadMessageSingleGroup
  | LoadMessageSingleGroupFailure
  | LoadMessageSingleGroupSuccess
  | CreateMessageGroup
  | CreateMessageGroupSuccess
  | CreateMessageGroupFailure
  | UpdateMessageGroup
  | UpdateMessageGroupFailure
  | UpdateMessageGroupSuccess
  | DeleteMessageGroup
  | DeleteMessageGroupFailure
  | DeleteMessageGroupSuccess
  | LoadChatRooms
  | LoadChatRoomsFailure
  | LoadChatRoomsSuccess
  | LoadUnreadsCount
  | LoadUnreadsCountFailure
  | LoadUnreadsCountSuccess
  | SetCurrentMessageSocialSecurityNum;
