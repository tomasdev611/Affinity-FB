import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotifierService} from 'angular-notifier';
import {
  UserActionTypes,
  LoadUsers,
  LoadUsersFailure,
  LoadUsersSuccess,
  LoadSingleUser,
  LoadSingleUserSuccess,
  LoadSingleUserFailure,
  UpdateSingleUser,
  UpdateSingleUserSuccess,
  UpdateSingleUserFailure,
  UpdateSingleUserPassword,
  UpdateSingleUserPasswordSuccess,
  UpdateSingleUserPasswordFailure,
  CreateSingleUser,
  CreateSingleUserFailure,
  CreateSingleUserSuccess,
  DeleteSingleUser,
  DeleteSingleUserFailure,
  DeleteSingleUserSuccess
} from '../actions/user.actions';
import {UserService} from '../../services/db/user.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {getErrorMessage} from '../../utils/helpers';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {IdleExpiry} from '@ng-idle/core';

@Injectable()
export class UserEffects {
  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadUsers),
    map((action: LoadUsers) => action),
    switchMap(() =>
      this.userService.fetchSecurityUsers().pipe(
        map((users: any[]) => new LoadUsersSuccess(users)),
        catchError(error => of(new LoadUsersFailure()))
      )
    )
  );

  @Effect()
  LoadSingleUser$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadSingleUser),
    map((action: LoadSingleUser) => action),
    switchMap((data: any) =>
      this.userService.getUserInfo(data.payload).pipe(
        map((response: any) => new LoadSingleUserSuccess({response, userName: data.payload})),
        catchError(error => of(new LoadSingleUserFailure()))
      )
    )
  );

  @Effect()
  UpdateSingleUser$ = this.actions$.pipe(
    ofType(UserActionTypes.UpdateSingleUser),
    map((action: UpdateSingleUser) => action),
    switchMap((data: any) =>
      this.userService.updateUserData(data.payload.userName, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'User has been successfully updated');
          return new UpdateSingleUserSuccess({
            response,
            userName: data.payload.userName,
            action: 'update'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error, 'Failed to update user'));
          return of(new UpdateSingleUserFailure());
        })
      )
    )
  );

  @Effect()
  DeleteSingleUser$ = this.actions$.pipe(
    ofType(UserActionTypes.DeleteSingleUser),
    map((action: DeleteSingleUser) => action),
    switchMap((data: any) =>
      this.userService.deleteUserData(data.payload.userName).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'User has been successfully deleted');
          return new DeleteSingleUserSuccess({
            response,
            userName: data.payload.userName,
            action: 'delete'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error, 'Failed to delete user'));
          return of(new DeleteSingleUserFailure());
        })
      )
    )
  );

  @Effect()
  CreateSingleUser$ = this.actions$.pipe(
    ofType(UserActionTypes.CreateSingleUser),
    map((action: CreateSingleUser) => action),
    switchMap((data: any) =>
      this.userService.postAddUserData(data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'User has been successfully created');
          return new CreateSingleUserSuccess({
            response,
            userName: data.payload.data.userName,
            target: 'personaldata',
            action: 'create'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error, 'Failed to created user'));
          return of(new CreateSingleUserFailure());
        })
      )
    )
  );

  @Effect()
  UpdateSingleUserPassword$ = this.actions$.pipe(
    ofType(UserActionTypes.UpdateSingleUserPassword),
    map((action: UpdateSingleUserPassword) => action),
    switchMap((data: any) =>
      this.userService.resetUserPassword(data.payload.userName, data.payload.data).pipe(
        map((personaldata: any) => {
          this.notifierService.notify('success', 'User has been successfully updated');
          return new UpdateSingleUserPasswordSuccess({
            personaldata,
            userName: data.payload.userName,
            target: 'personaldata',
            action: 'update'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error, 'Failed to update user'));
          return of(new UpdateSingleUserPasswordFailure());
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private notifierService: NotifierService
  ) {}
}
