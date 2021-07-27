import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotifierService} from 'angular-notifier';
import {
  CalendarActionTypes,
  LoadClientCaregiverNames,
  LoadClientCaregiverNamesFailure,
  LoadClientCaregiverNamesSuccess
} from '../actions/calendar.actions';

import {CalendarService} from '../../services/db/calendar.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {IdleExpiry} from '@ng-idle/core';

@Injectable()
export class CalendarEffects {
  @Effect()
  LoadClientCaregiverNames$ = this.actions$.pipe(
    ofType(CalendarActionTypes.LoadClientCaregiverNames),
    map((action: LoadClientCaregiverNames) => action),
    switchMap(() =>
      this.calendarService.fetchCalendarData().pipe(
        map((response: any) => new LoadClientCaregiverNamesSuccess(response)),
        catchError(error => of(new LoadClientCaregiverNamesFailure()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private notifierService: NotifierService
  ) {}
}
