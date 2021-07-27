import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {
  MessageActionTypes,
  LoadMessages,
  LoadMessagesFailure,
  LoadMessagesSuccess,
  LoadChatRooms,
  LoadChatRoomsFailure,
  LoadChatRoomsSuccess,
  SendMessage,
  SendMessageFailure,
  SendMessageSuccess,
  LoadMessageGroups,
  LoadMessageGroupsSuccess,
  LoadMessageGroupsFailure,
  LoadMessageSingleGroup,
  LoadMessageSingleGroupFailure,
  LoadMessageSingleGroupSuccess,
  CreateMessageGroup,
  CreateMessageGroupSuccess,
  CreateMessageGroupFailure,
  UpdateMessageGroup,
  UpdateMessageGroupFailure,
  UpdateMessageGroupSuccess,
  DeleteMessageGroup,
  DeleteMessageGroupFailure,
  DeleteMessageGroupSuccess,
  LoadUnreadsCount,
  LoadUnreadsCountFailure,
  LoadUnreadsCountSuccess
  // Reminders
  // Attachments
} from '../actions/message.actions';
import {MessageService} from '../../services/db/message.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {IdleExpiry} from '@ng-idle/core';
import {getErrorMessage} from '../../utils/helpers';

@Injectable()
export class MessageEffects {
  @Effect()
  loadMessages$ = this.actions$.pipe(
    ofType(MessageActionTypes.LoadMessages),
    map((action: LoadMessages) => action),
    switchMap((params: any) =>
      this.messageService.getAllMessageWithOption(params).pipe(
        map((messages: any[]) => new LoadMessagesSuccess(messages)),
        catchError(error => of(new LoadMessagesFailure()))
      )
    )
  );

  @Effect()
  loadChatRooms$ = this.actions$.pipe(
    ofType(MessageActionTypes.LoadChatRooms),
    map((action: LoadChatRooms) => action),
    switchMap((data: any) =>
      this.messageService.getChatRooms(data.payload).pipe(
        map((response: any) => new LoadChatRoomsSuccess(response)),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new LoadChatRoomsFailure());
        })
      )
    )
  );

  @Effect()
  loadUnreadsCount$ = this.actions$.pipe(
    ofType(MessageActionTypes.LoadUnreadsCount),
    map((action: LoadUnreadsCount) => action),
    switchMap((data: any) =>
      this.messageService.getUnreadCount().pipe(
        map((response: any) => new LoadUnreadsCountSuccess(response)),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new LoadUnreadsCountFailure());
        })
      )
    )
  );

  @Effect()
  SendMessage$ = this.actions$.pipe(
    ofType(MessageActionTypes.SendMessage),
    map((action: SendMessage) => action),
    switchMap((data: any) =>
      this.messageService.sendNewMessage(data.payload).pipe(
        map((personaldata: any) => {
          // this.notifierService.notify('success', 'Message has been successfully created');
          // this.router.navigate([`/message/details/${personaldata.SocialSecurityNum}`]);
          return new SendMessageSuccess({
            personaldata,
            SocialSecurityNum: personaldata.SocialSecurityNum,
            target: 'personaldata',
            action: 'create'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new SendMessageFailure());
        })
      )
    )
  );

  @Effect()
  LoadMessageGroups$ = this.actions$.pipe(
    ofType(MessageActionTypes.LoadMessageGroups),
    map((action: LoadMessageGroups) => action),
    switchMap(() =>
      this.messageService.fetchAllGroups().pipe(
        map((commons: any) => new LoadMessageGroupsSuccess(commons)),
        catchError(error => of(new LoadMessageGroupsFailure()))
      )
    )
  );

  @Effect()
  LoadMessageSingleGroup$ = this.actions$.pipe(
    ofType(MessageActionTypes.LoadMessageSingleGroup),
    map((action: LoadMessageSingleGroup) => action),
    switchMap((data: any) =>
      this.messageService.fetchSingleGroup(data.payload.GroupId).pipe(
        map((response: any) => new LoadMessageSingleGroupSuccess({...data.payload, ...response})),
        catchError(error => {
          this.notifierService.notify('error', `${error}`);
          return of(new LoadMessageSingleGroupFailure());
        })
      )
    )
  );

  @Effect()
  UpdateMessageGroup$ = this.actions$.pipe(
    ofType(MessageActionTypes.UpdateMessageGroup),
    map((action: UpdateMessageGroup) => action),
    switchMap((data: any) =>
      this.messageService.updateMessageGroup(data.payload.GroupId, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Message Group has been successfully updated');
          return new UpdateMessageGroupSuccess({
            ...data.payload,
            ...response,
            action: 'update'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new UpdateMessageGroupFailure());
        })
      )
    )
  );

  @Effect()
  CreateMessageGroup$ = this.actions$.pipe(
    ofType(MessageActionTypes.CreateMessageGroup),
    map((action: CreateMessageGroup) => action),
    switchMap((data: any) =>
      this.messageService.createMessageGroup(data.payload).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Message Group has been successfully created');
          return new CreateMessageGroupSuccess({
            ...data.payload,
            ...response,
            action: 'create'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new CreateMessageGroupFailure());
        })
      )
    )
  );

  @Effect()
  DeleteMessageGroup$ = this.actions$.pipe(
    ofType(MessageActionTypes.DeleteMessageGroup),
    map((action: DeleteMessageGroup) => action),
    switchMap((data: any) =>
      this.messageService.deleteMessageGroup(data.payload.GroupId).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Message Group has been successfully deleted');
          return new DeleteMessageGroupSuccess({
            ...data.payload
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new DeleteMessageGroupFailure());
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private messageService: MessageService,
    private notifierService: NotifierService,
    private router: Router
  ) {}
}
