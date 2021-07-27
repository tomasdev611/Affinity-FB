import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotifierService} from 'angular-notifier';
import {
  ComplianceActionTypes,
  LoadClientCompliances,
  LoadClientCompliancesFailure,
  LoadClientCompliancesSuccess,
  LoadCaregiverCompliances,
  LoadCaregiverCompliancesFailure,
  LoadCaregiverCompliancesSuccess,
  LoadCaregiverContacts,
  LoadCaregiverContactsFailure,
  LoadCaregiverContactsSuccess,
  LoadClientContacts,
  LoadClientContactsSuccess,
  LoadClientContactsFailure
} from '../actions/compliance.actions';
import {ComplianceService} from '../../services/db/compliance.service';
import {CaregiverService} from '../../services/db/caregiver.service';
import {ClientService} from '../../services/db/client.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {IdleExpiry} from '@ng-idle/core';

@Injectable()
export class ComplianceEffects {
  @Effect()
  LoadClientCompliances$ = this.actions$.pipe(
    ofType(ComplianceActionTypes.LoadClientCompliances),
    map((action: LoadClientCompliances) => action),
    switchMap((data: any) =>
      this.complianceService.getClientCompliances(data.payload).pipe(
        map((compliances: any[]) => new LoadClientCompliancesSuccess(compliances)),
        catchError(error => of(new LoadClientCompliancesFailure()))
      )
    )
  );

  @Effect()
  LoadCaregiverCompliances$ = this.actions$.pipe(
    ofType(ComplianceActionTypes.LoadCaregiverCompliances),
    map((action: LoadCaregiverCompliances) => action),
    switchMap((data: any) =>
      this.complianceService.getCaregiverCompliances(data.payload).pipe(
        map((compliances: any[]) => new LoadCaregiverCompliancesSuccess(compliances)),
        catchError(error => of(new LoadCaregiverCompliancesFailure()))
      )
    )
  );

  @Effect()
  LoadCaregiverContacts$ = this.actions$.pipe(
    ofType(ComplianceActionTypes.LoadCaregiverContacts),
    map((action: LoadCaregiverContacts) => action),
    switchMap((data: any) =>
      this.clientService.getAllClientWithCustomFields(data.payload).pipe(
        map((clients: any[]) => new LoadCaregiverContactsSuccess(clients)),
        catchError(error => of(new LoadCaregiverContactsFailure()))
      )
    )
  );

  @Effect()
  LoadClientContacts$ = this.actions$.pipe(
    ofType(ComplianceActionTypes.LoadClientContacts),
    map((action: LoadClientContacts) => action),
    switchMap((data: any) =>
      this.caregiverService.getAllCaregiverWithCustomFields(data.payload).pipe(
        map((caregivers: any[]) => new LoadClientContactsSuccess(caregivers)),
        catchError(error => of(new LoadClientContactsFailure()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private complianceService: ComplianceService,
    private caregiverService: CaregiverService,
    private clientService: ClientService,
    private notifierService: NotifierService
  ) {}
}
