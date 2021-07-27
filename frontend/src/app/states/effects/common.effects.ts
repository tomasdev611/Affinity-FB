import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotifierService} from 'angular-notifier';
import {
  LoadClientCommonInfo,
  LoadClientCommonInfoFailure,
  LoadClientCommonInfoSuccess,
  LoadCommonInfo,
  LoadCommonInfoFailure,
  LoadCommonInfoSuccess,
  CreateCommonData,
  CreateCommonDataFailure,
  CreateCommonDataSuccess,
  UpdateCommonData,
  UpdateCommonDataFailure,
  UpdateCommonDataSuccess,
  DeleteCommonData,
  DeleteCommonDataFailure,
  DeleteCommonDataSuccess,
  CommonActionTypes
} from '../actions/common.actions';

import {CommonService} from '../../services/db/common.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';

@Injectable()
export class CommonEffects {
  @Effect()
  LoadClientCommonInfo$ = this.actions$.pipe(
    ofType(CommonActionTypes.LoadClientCommonInfo),
    map((action: LoadClientCommonInfo) => action),
    switchMap(() =>
      this.commonService.getClientCommonInfo().pipe(
        map((commons: any) => new LoadClientCommonInfoSuccess(commons)),
        catchError(error => of(new LoadClientCommonInfoFailure()))
      )
    )
  );

  @Effect()
  LoadCommonInfo$ = this.actions$.pipe(
    ofType(CommonActionTypes.LoadCommonInfo),
    map((action: LoadCommonInfo) => action),
    switchMap(() =>
      this.commonService.getCommonInfo().pipe(
        map((commons: any) => new LoadCommonInfoSuccess(commons)),
        catchError(error => of(new LoadCommonInfoFailure()))
      )
    )
  );

  @Effect()
  UpdateCommonData$ = this.actions$.pipe(
    ofType(CommonActionTypes.UpdateCommonData),
    map((action: UpdateCommonData) => action),
    switchMap((data: any) =>
      this.commonService.updateCommonData(data.payload).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Data has been successfully updated');
          return new UpdateCommonDataSuccess({
            ...data.payload,
            ...response,
            action: 'update'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update data');
          return of(new UpdateCommonDataFailure());
        })
      )
    )
  );

  @Effect()
  CreateCommonData$ = this.actions$.pipe(
    ofType(CommonActionTypes.CreateCommonData),
    map((action: CreateCommonData) => action),
    switchMap((data: any) =>
      this.commonService.createCommonData(data.payload).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Data has been successfully created');
          return new CreateCommonDataSuccess({
            ...data.payload,
            ...response,
            action: 'create'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to create data');
          return of(new CreateCommonDataFailure());
        })
      )
    )
  );

  @Effect()
  DeleteCommonData$ = this.actions$.pipe(
    ofType(CommonActionTypes.DeleteCommonData),
    map((action: DeleteCommonData) => action),
    switchMap((data: any) =>
      this.commonService.deleteCommonData(data.payload).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Data has been successfully deleted');
          return new DeleteCommonDataSuccess({
            ...data.payload,
            ...response,
            action: 'delete'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to delete data');
          return of(new DeleteCommonDataFailure());
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private commonService: CommonService,
    private notifierService: NotifierService
  ) {}
}
