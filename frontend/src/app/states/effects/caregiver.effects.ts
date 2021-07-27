import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {pick} from 'lodash';
import {
  CaregiverActionTypes,
  LoadCaregivers,
  LoadCaregiversFailure,
  LoadCaregiversSuccess,
  SearchCaregivers,
  SearchCaregiversFailure,
  SearchCaregiversSuccess,
  GetSearchCaregiversPage,
  GetSearchCaregiversPageFailure,
  GetSearchCaregiversPageSuccess,
  LoadSingleCaregiver,
  LoadSingleCaregiverSuccess,
  LoadSingleCaregiverFailure,
  UpdateSingleCaregiver,
  UpdateSingleCaregiverSuccess,
  UpdateSingleCaregiverFailure,
  CreateSingleCaregiver,
  CreateSingleCaregiverFailure,
  CreateSingleCaregiverSuccess,
  // Reminders
  LoadCaregiverReminders,
  LoadCaregiverRemindersFailure,
  LoadCaregiverRemindersSuccess,
  CreateCaregiverReminders,
  CreateCaregiverRemindersFailure,
  CreateCaregiverRemindersSuccess,
  UpdateCaregiverReminders,
  UpdateCaregiverRemindersFailure,
  UpdateCaregiverRemindersSuccess,
  DeleteCaregiverReminders,
  DeleteCaregiverRemindersFailure,
  DeleteCaregiverRemindersSuccess,
  // Attachments
  LoadCaregiverAttachments,
  LoadCaregiverAttachmentsFailure,
  LoadCaregiverAttachmentsSuccess,
  CreateCaregiverAttachments,
  CreateCaregiverAttachmentsFailure,
  CreateCaregiverAttachmentsSuccess,
  UpdateCaregiverAttachments,
  UpdateCaregiverAttachmentsFailure,
  UpdateCaregiverAttachmentsSuccess,
  DeleteCaregiverAttachments,
  DeleteCaregiverAttachmentsFailure,
  DeleteCaregiverAttachmentsSuccess,
  LoadCaregiverContacts,
  LoadCaregiverContactsFailure,
  LoadCaregiverContactsSuccess,
  CreateCaregiverContacts,
  CreateCaregiverContactsFailure,
  CreateCaregiverContactsSuccess,
  UpdateCaregiverContacts,
  UpdateCaregiverContactsFailure,
  UpdateCaregiverContactsSuccess,
  DeleteCaregiverContacts,
  DeleteCaregiverContactsFailure,
  DeleteCaregiverContactsSuccess,
  LoadCaregiverCustomFields,
  LoadCaregiverCustomFieldsFailure,
  LoadCaregiverCustomFieldsSuccess,
  UpdateCaregiverCustomFields,
  UpdateCaregiverCustomFieldsFailure,
  UpdateCaregiverCustomFieldsSuccess,
  UpdateCaregiverCustomFieldsAll,
  UpdateCaregiverCustomFieldsAllFailure,
  UpdateCaregiverCustomFieldsAllSuccess,
  LoadCaregiverNotes,
  LoadCaregiverNotesFailure,
  LoadCaregiverNotesSuccess,
  CreateCaregiverNotes,
  CreateCaregiverNotesFailure,
  CreateCaregiverNotesSuccess,
  UpdateCaregiverNotes,
  UpdateCaregiverNotesFailure,
  UpdateCaregiverNotesSuccess,
  DeleteCaregiverNotes,
  DeleteCaregiverNotesFailure,
  DeleteCaregiverNotesSuccess,
  LoadCaregiverVisits,
  LoadCaregiverVisitsFailure,
  LoadCaregiverVisitsSuccess,
  UpdateCaregiverSkills,
  UpdateCaregiverSkillsFailure,
  UpdateCaregiverSkillsSuccess,
  UpdateCaregiverAvailabilities,
  UpdateCaregiverAvailabilitiesFailure,
  UpdateCaregiverAvailabilitiesSuccess,
  UpdateCaregiverLanguages,
  UpdateCaregiverLanguagesFailure,
  UpdateCaregiverLanguagesSuccess,
  GetSearchCaregiversPageForRemove,
  GetSearchCaregiversPageForRemoveSuccess,
  GetSearchCaregiversPageForRemoveFailure
} from '../actions/caregiver.actions';
import {CaregiverService} from '../../services/db/caregiver.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {IdleExpiry} from '@ng-idle/core';
import {getErrorMessage} from '../../utils/helpers';

@Injectable()
export class CaregiverEffects {
  @Effect()
  loadCaregivers$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregivers),
    map((action: LoadCaregivers) => action),
    switchMap(() =>
      this.caregiverService.getAllCaregiverWithCustomFields().pipe(
        map((caregivers: any[]) => new LoadCaregiversSuccess(caregivers)),
        catchError(error => of(new LoadCaregiversFailure()))
      )
    )
  );

  @Effect()
  searchCaregivers$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.SearchCaregivers),
    map((action: SearchCaregivers) => action),
    switchMap(data =>
      this.caregiverService.searchCaregivers(data.payload).pipe(
        map((response: any) => new SearchCaregiversSuccess(response)),
        catchError(error => of(new SearchCaregiversFailure()))
      )
    )
  );

  @Effect()
  getSearchCaregiversPage$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.GetSearchCaregiversPage),
    map((action: GetSearchCaregiversPage) => action),
    switchMap(data =>
      this.caregiverService.searchCaregiversPage(data.payload).pipe(
        map((response: any) => new GetSearchCaregiversPageSuccess(response)),
        catchError(error => of(new GetSearchCaregiversPageFailure()))
      )
    )
  );

  @Effect()
  GetSearchCaregiversPageForRemove$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.GetSearchCaregiversPageForRemove),
    map((action: GetSearchCaregiversPageForRemove) => action),
    switchMap(data =>
      data.payload.ids.length > 0
        ? this.caregiverService.searchCaregiversPage(pick(data.payload, ['ids', 'ClientId'])).pipe(
            map((response: any) => new GetSearchCaregiversPageForRemoveSuccess(response)),
            catchError(error => of(new GetSearchCaregiversPageForRemoveFailure()))
          )
        : null
    )
  );

  @Effect()
  LoadSingleCaregiver$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadSingleCaregiver),
    map((action: LoadSingleCaregiver) => action),
    switchMap((data: any) =>
      this.caregiverService.getCaregiverInfo(data.payload).pipe(
        map(
          (response: any) =>
            new LoadSingleCaregiverSuccess({
              ...response,
              SocialSecurityNum: data.payload,
              target: 'all'
            })
        ),
        catchError(error => {
          this.notifierService.notify('error', 'Caregiver not found');
          this.router.navigate([`/caregiver/list`]);
          return of(new LoadSingleCaregiverFailure());
        })
      )
    )
  );

  @Effect()
  UpdateSingleCaregiver$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateSingleCaregiver),
    map((action: UpdateSingleCaregiver) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateCaregiverData(data.payload.SocialSecurityNum, data.payload.data)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Caregiver has been successfully updated');
            return new UpdateSingleCaregiverSuccess({
              ...response,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              target: 'personaldata',
              action: 'update'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', getErrorMessage(error));
            return of(new UpdateSingleCaregiverFailure());
          })
        )
    )
  );

  @Effect()
  CreateSingleCaregiver$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.CreateSingleCaregiver),
    map((action: CreateSingleCaregiver) => action),
    switchMap((data: any) =>
      this.caregiverService.postAddCaregiverData(data.payload.data).pipe(
        map((personaldata: any) => {
          this.notifierService.notify('success', 'Caregiver has been successfully created');
          // this.router.navigate([`/caregiver/details/${personaldata.SocialSecurityNum}`]);
          return new CreateSingleCaregiverSuccess({
            personaldata,
            SocialSecurityNum: personaldata.SocialSecurityNum,
            target: 'personaldata',
            action: 'create'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', getErrorMessage(error));
          return of(new CreateSingleCaregiverFailure());
        })
      )
    )
  );

  @Effect()
  LoadCaregiverReminders$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregiverReminders),
    map((action: LoadCaregiverReminders) => action),
    switchMap((data: any) =>
      this.caregiverService.getReminders(data.payload).pipe(
        map(
          (reminders: any[]) =>
            new LoadCaregiverRemindersSuccess({
              reminders,
              SocialSecurityNum: data.payload,
              target: 'reminders'
            })
        ),
        catchError(error => of(new LoadCaregiverRemindersFailure()))
      )
    )
  );

  @Effect()
  CreateCaregiverReminders$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.CreateCaregiverReminders),
    map((action: CreateCaregiverReminders) => action),
    switchMap((data: any) =>
      this.caregiverService.createReminder(data.payload.SocialSecurityNum, data.payload.data).pipe(
        map((reminder: any) => {
          this.notifierService.notify('success', 'Reminder has been successfully created');
          return new CreateCaregiverRemindersSuccess({
            data: reminder,
            SocialSecurityNum: data.payload.SocialSecurityNum,
            action: 'create',
            target: 'reminders'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update reminder');
          return of(new CreateCaregiverRemindersFailure());
        })
      )
    )
  );

  @Effect()
  UpdateCaregiverReminders$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverReminders),
    map((action: UpdateCaregiverReminders) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateReminder(
          data.payload.SocialSecurityNum,
          data.payload.ExpirationID,
          data.payload.data
        )
        .pipe(
          map((reminder: any) => {
            this.notifierService.notify('success', 'Reminder has been successfully updated');
            return new UpdateCaregiverRemindersSuccess({
              data: reminder,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'update',
              target: 'reminders',
              idField: 'ExpirationID'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update reminder');
            return of(new UpdateCaregiverRemindersFailure());
          })
        )
    )
  );

  @Effect()
  DeleteCaregiverReminders$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.DeleteCaregiverReminders),
    map((action: DeleteCaregiverReminders) => action),
    switchMap((data: any) =>
      this.caregiverService
        .deleteReminder(data.payload.SocialSecurityNum, data.payload.ExpirationID)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Reminder has been successfully deleted');
            return new DeleteCaregiverRemindersSuccess({
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'delete',
              data: data.payload,
              target: 'reminders',
              idField: 'ExpirationID'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to delete reminder');
            return of(new DeleteCaregiverRemindersFailure());
          })
        )
    )
  );

  // Attachments
  @Effect()
  LoadCaregiverAttachments$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregiverAttachments),
    map((action: LoadCaregiverAttachments) => action),
    switchMap((data: any) =>
      this.caregiverService.getAttachmentData(data.payload).pipe(
        map(
          (attachments: any[]) =>
            new LoadCaregiverAttachmentsSuccess({
              attachments,
              SocialSecurityNum: data.payload,
              target: 'attachments'
            })
        ),
        catchError(error => of(new LoadCaregiverAttachmentsFailure()))
      )
    )
  );

  @Effect()
  CreateCaregiverAttachments$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.CreateCaregiverAttachments),
    map((action: CreateCaregiverAttachments) => action),
    switchMap((data: any) =>
      this.caregiverService
        .createAttachment(data.payload.SocialSecurityNum, data.payload.data)
        .pipe(
          map((attachment: any) => {
            this.notifierService.notify('success', 'Attachment has been successfully created');
            return new CreateCaregiverAttachmentsSuccess({
              data: attachment,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'create',
              target: 'attachments'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update attachment');
            return of(new CreateCaregiverAttachmentsFailure());
          })
        )
    )
  );

  @Effect()
  UpdateCaregiverAttachments$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverAttachments),
    map((action: UpdateCaregiverAttachments) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateAttachment(
          data.payload.SocialSecurityNum,
          data.payload.attachmentId,
          data.payload.data
        )
        .pipe(
          map((attachment: any) => {
            this.notifierService.notify('success', 'Attachment has been successfully updated');
            return new UpdateCaregiverAttachmentsSuccess({
              data: attachment,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'update',
              target: 'attachments',
              idField: 'attachmentId'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update attachment');
            return of(new UpdateCaregiverAttachmentsFailure());
          })
        )
    )
  );

  @Effect()
  DeleteCaregiverAttachments$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.DeleteCaregiverAttachments),
    map((action: DeleteCaregiverAttachments) => action),
    switchMap((data: any) =>
      this.caregiverService
        .deleteAattachment(data.payload.SocialSecurityNum, data.payload.attachmentId)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Attachment has been successfully deleted');
            return new DeleteCaregiverAttachmentsSuccess({
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'delete',
              data: data.payload,
              target: 'attachments',
              idField: 'attachmentId'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to delete attachment');
            return of(new DeleteCaregiverAttachmentsFailure());
          })
        )
    )
  );

  @Effect()
  LoadCaregiverContacts$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregiverContacts),
    map((action: LoadCaregiverContacts) => action),
    switchMap((data: any) =>
      this.caregiverService.getContactDetails(data.payload).pipe(
        map(
          (contacts: any[]) =>
            new LoadCaregiverContactsSuccess({contacts, SocialSecurityNum: data.payload})
        ),
        catchError(error => of(new LoadCaregiverContactsFailure()))
      )
    )
  );

  @Effect()
  CreateCaregiverContacts$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.CreateCaregiverContacts),
    map((action: CreateCaregiverContacts) => action),
    switchMap((data: any) =>
      this.caregiverService.createContact(data.payload.SocialSecurityNum, data.payload.data).pipe(
        map((contact: any) => {
          this.notifierService.notify('success', 'Contact has been successfully created');
          return new CreateCaregiverContactsSuccess({
            data: contact,
            SocialSecurityNum: data.payload.SocialSecurityNum,
            action: 'create',
            target: 'contacts'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update contact');
          return of(new CreateCaregiverContactsFailure());
        })
      )
    )
  );

  @Effect()
  UpdateCaregiverContacts$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverContacts),
    map((action: UpdateCaregiverContacts) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateContact(data.payload.SocialSecurityNum, data.payload.ContactID, data.payload.data)
        .pipe(
          map((contact: any) => {
            this.notifierService.notify('success', 'Contact has been successfully updated');
            return new UpdateCaregiverContactsSuccess({
              data: contact,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'update',
              target: 'contacts',
              idField: 'ContactID'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update Contact');
            return of(new UpdateCaregiverContactsFailure());
          })
        )
    )
  );

  @Effect()
  DeleteCaregiverContacts$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.DeleteCaregiverContacts),
    map((action: DeleteCaregiverContacts) => action),
    switchMap((data: any) =>
      this.caregiverService
        .deleteContact(data.payload.SocialSecurityNum, data.payload.ContactID)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Contact has been successfully deleted');
            return new DeleteCaregiverContactsSuccess({
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'delete',
              data: data.payload,
              target: 'contacts',
              idField: 'ContactID'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to delete Contact');
            return of(new DeleteCaregiverContactsFailure());
          })
        )
    )
  );

  @Effect()
  LoadCaregiverCustomFields$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregiverCustomFields),
    map((action: LoadCaregiverCustomFields) => action),
    switchMap((data: any) =>
      this.caregiverService.getCustomFields(data.payload).pipe(
        map(
          (customfields: any[]) =>
            new LoadCaregiverCustomFieldsSuccess({customfields, SocialSecurityNum: data.payload})
        ),
        catchError(error => of(new LoadCaregiverCustomFieldsFailure()))
      )
    )
  );

  @Effect()
  UpdateCaregiverCustomFields$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverCustomFields),
    map((action: UpdateCaregiverCustomFields) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateCustomField(data.payload.SocialSecurityNum, data.payload.data)
        .pipe(
          map((CustomField: any) => {
            this.notifierService.notify('success', 'Custom Field has been successfully updated');
            return new UpdateCaregiverCustomFieldsSuccess({
              data: CustomField,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'create-update',
              target: 'customfields',
              idField: 'cfieldName'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update Custom Field');
            return of(new UpdateCaregiverCustomFieldsFailure());
          })
        )
    )
  );

  @Effect()
  UpdateCaregiverCustomFieldsAll$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverCustomFieldsAll),
    map((action: UpdateCaregiverCustomFieldsAll) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateCustomFieldAll(data.payload.SocialSecurityNum, data.payload.data)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Custom Field has been successfully updated');
            return new UpdateCaregiverCustomFieldsAllSuccess({
              ...response,
              // data: CustomField,
              SocialSecurityNum: data.payload.SocialSecurityNum
              // action: 'create-update',
              // target: 'customfields',
              // idField: 'cfieldName'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update Custom Field');
            return of(new UpdateCaregiverCustomFieldsAllFailure());
          })
        )
    )
  );

  @Effect()
  LoadCaregiverNotes$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregiverNotes),
    map((action: LoadCaregiverNotes) => action),
    switchMap((data: any) =>
      this.caregiverService.getAllNotes(data.payload).pipe(
        map(
          (notes: any[]) =>
            new LoadCaregiverNotesSuccess({notes, SocialSecurityNum: data.payload, target: 'notes'})
        ),
        catchError(error => of(new LoadCaregiverNotesFailure()))
      )
    )
  );

  @Effect()
  CreateCaregiverNotes$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.CreateCaregiverNotes),
    map((action: CreateCaregiverNotes) => action),
    switchMap((data: any) =>
      this.caregiverService.createNote(data.payload.SocialSecurityNum, data.payload.data).pipe(
        map((note: any) => {
          this.notifierService.notify('success', 'Note has been successfully created');
          return new CreateCaregiverNotesSuccess({
            data: note,
            SocialSecurityNum: data.payload.SocialSecurityNum,
            action: 'create',
            target: 'notes'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update Note');
          return of(new CreateCaregiverNotesFailure());
        })
      )
    )
  );

  @Effect()
  UpdateCaregiverNotes$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverNotes),
    map((action: UpdateCaregiverNotes) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateNote(
          data.payload.SocialSecurityNum,
          data.payload.NoteDate,
          data.payload.NoteTime,
          data.payload.data
        )
        .pipe(
          map((note: any) => {
            this.notifierService.notify('success', 'Note has been successfully updated');
            return new UpdateCaregiverNotesSuccess({
              data: note,
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'update',
              target: 'notes',
              idField: ['NoteDate', 'NoteTime'],
              idData: {
                NoteDate: data.payload.NoteDate,
                NoteTime: data.payload.NoteTime
              }
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update Note');
            return of(new UpdateCaregiverNotesFailure());
          })
        )
    )
  );

  @Effect()
  DeleteCaregiverNotes$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.DeleteCaregiverNotes),
    map((action: DeleteCaregiverNotes) => action),
    switchMap((data: any) =>
      this.caregiverService
        .deleteNote(data.payload.SocialSecurityNum, data.payload.NoteDate, data.payload.NoteTime)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Note has been successfully deleted');
            return new DeleteCaregiverNotesSuccess({
              SocialSecurityNum: data.payload.SocialSecurityNum,
              action: 'delete',
              data: data.payload,
              target: 'notes',
              idField: ['NoteDate', 'NoteTime']
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to delete Note');
            return of(new DeleteCaregiverNotesFailure());
          })
        )
    )
  );

  @Effect()
  LoadCaregiverVisits$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.LoadCaregiverVisits),
    map((action: LoadCaregiverVisits) => action),
    switchMap((data: any) =>
      this.caregiverService.getVisitHistory(data.payload).pipe(
        map(
          (visits: any[]) =>
            new LoadCaregiverVisitsSuccess({
              visits,
              SocialSecurityNum: data.payload,
              target: 'visits'
            })
        ),
        catchError(error => of(new LoadCaregiverVisitsFailure()))
      )
    )
  );

  @Effect()
  UpdateCaregiverSkills$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverSkills),
    map((action: UpdateCaregiverSkills) => action),
    switchMap((data: any) =>
      this.caregiverService.updateSkills(data.payload.SocialSecurityNum, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Skills has been successfully updated');
          return new UpdateCaregiverSkillsSuccess({
            ...response,
            SocialSecurityNum: data.payload.SocialSecurityNum
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update skills');
          return of(new UpdateCaregiverSkillsFailure());
        })
      )
    )
  );

  @Effect()
  UpdateCaregiverLanguages$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverLanguages),
    map((action: UpdateCaregiverLanguages) => action),
    switchMap((data: any) =>
      this.caregiverService.updateLanguages(data.payload.SocialSecurityNum, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Languages has been successfully updated');
          return new UpdateCaregiverLanguagesSuccess({
            ...response,
            SocialSecurityNum: data.payload.SocialSecurityNum
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update languages');
          return of(new UpdateCaregiverLanguagesFailure());
        })
      )
    )
  );

  @Effect()
  UpdateCaregiverAvailabilities$ = this.actions$.pipe(
    ofType(CaregiverActionTypes.UpdateCaregiverAvailabilities),
    map((action: UpdateCaregiverAvailabilities) => action),
    switchMap((data: any) =>
      this.caregiverService
        .updateAvailabilities(data.payload.SocialSecurityNum, data.payload.data)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Availability has been successfully updated');
            return new UpdateCaregiverAvailabilitiesSuccess({
              ...response,
              SocialSecurityNum: data.payload.SocialSecurityNum
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update availabilities');
            return of(new UpdateCaregiverAvailabilitiesFailure());
          })
        )
    )
  );

  constructor(
    private actions$: Actions,
    private caregiverService: CaregiverService,
    private notifierService: NotifierService,
    private router: Router
  ) {}
}
