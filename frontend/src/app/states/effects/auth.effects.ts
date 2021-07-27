import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotifierService} from 'angular-notifier';
import {
  Login,
  LoginFailure,
  LoginSuccess,
  LoadCurrentUserInfo,
  LoadCurrentUserInfoFailure,
  LoadCurrentUserInfoSuccess,
  AuthActionTypes
} from '../actions/auth.actions';
import {AuthService} from '../../services/gaurd/auth.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

@Injectable()
export class AuthEffects {
  @Effect()
  Login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action: Login) => action),
    switchMap((data: any) =>
      this.authService.loginNew(data.payload).pipe(
        map((response: any) => new LoginSuccess(response)),
        catchError(error => {
          console.log('Login ERROR', error);
          const errorMessage =
            error && error.error && error.error.message
              ? error.error.message
              : 'Wrong username and password';
          this.notifierService.notify('error', errorMessage);
          return of(new LoginFailure());
        })
      )
    )
  );

  @Effect()
  LoadCurrentUserInfo$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoadCurrentUserInfo),
    map((action: LoadCurrentUserInfo) => action),
    switchMap((data: any) =>
      this.authService.getCurrentUserInfo().pipe(
        map((response: any) => new LoadCurrentUserInfoSuccess(response)),
        catchError(error => {
          this.authService.logout();
          return of(new LoadCurrentUserInfoFailure());
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {}
}
