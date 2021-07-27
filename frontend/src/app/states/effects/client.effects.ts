import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {NotifierService} from 'angular-notifier';
import {
  ClientActionTypes,
  LoadClients,
  LoadClientsFailure,
  LoadClientsSuccess,
  LoadSingleClient,
  LoadSingleClientSuccess,
  LoadSingleClientFailure,
  UpdateSingleClient,
  UpdateSingleClientSuccess,
  UpdateSingleClientFailure,
  CreateSingleClient,
  CreateSingleClientFailure,
  CreateSingleClientSuccess,
  // Reminders
  LoadClientReminders,
  LoadClientRemindersFailure,
  LoadClientRemindersSuccess,
  CreateClientReminders,
  CreateClientRemindersFailure,
  CreateClientRemindersSuccess,
  UpdateClientReminders,
  UpdateClientRemindersFailure,
  UpdateClientRemindersSuccess,
  DeleteClientReminders,
  DeleteClientRemindersFailure,
  DeleteClientRemindersSuccess,
  // Attachments
  LoadClientAttachments,
  LoadClientAttachmentsFailure,
  LoadClientAttachmentsSuccess,
  CreateClientAttachments,
  CreateClientAttachmentsFailure,
  CreateClientAttachmentsSuccess,
  UpdateClientAttachments,
  UpdateClientAttachmentsFailure,
  UpdateClientAttachmentsSuccess,
  DeleteClientAttachments,
  DeleteClientAttachmentsFailure,
  DeleteClientAttachmentsSuccess,
  LoadClientContacts,
  LoadClientContactsFailure,
  LoadClientContactsSuccess,
  CreateClientContacts,
  CreateClientContactsFailure,
  CreateClientContactsSuccess,
  UpdateClientContacts,
  UpdateClientContactsFailure,
  UpdateClientContactsSuccess,
  DeleteClientContacts,
  DeleteClientContactsFailure,
  DeleteClientContactsSuccess,
  LoadClientCustomFields,
  LoadClientCustomFieldsFailure,
  LoadClientCustomFieldsSuccess,
  UpdateClientCustomFields,
  UpdateClientCustomFieldsFailure,
  UpdateClientCustomFieldsSuccess,
  UpdateClientCustomFieldsAll,
  UpdateClientCustomFieldsAllFailure,
  UpdateClientCustomFieldsAllSuccess,
  LoadClientNotes,
  LoadClientNotesFailure,
  LoadClientNotesSuccess,
  CreateClientNotes,
  CreateClientNotesFailure,
  CreateClientNotesSuccess,
  UpdateClientNotes,
  UpdateClientNotesFailure,
  UpdateClientNotesSuccess,
  DeleteClientNotes,
  DeleteClientNotesFailure,
  DeleteClientNotesSuccess,
  LoadClientVisits,
  LoadClientVisitsFailure,
  LoadClientVisitsSuccess,
  UpdateClientSkills,
  UpdateClientSkillsFailure,
  UpdateClientSkillsSuccess,
  UpdateClientAvailabilities,
  UpdateClientAvailabilitiesFailure,
  UpdateClientAvailabilitiesSuccess,
  UpdateClientLanguages,
  UpdateClientLanguagesFailure,
  UpdateClientLanguagesSuccess
} from '../actions/client.actions';
import {ClientService} from '../../services/db/client.service';
import {catchError, flatMap, map, switchMap, tap} from 'rxjs/operators';
import {Client} from '../../core/models';
import {of} from 'rxjs/internal/observable/of';
import {combineLatest} from 'rxjs/internal/observable/combineLatest';
import {IdleExpiry} from '@ng-idle/core';

@Injectable()
export class ClientEffects {
  @Effect()
  loadClients$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClients),
    map((action: LoadClients) => action),
    switchMap(() =>
      this.clientService.getAllClientWithCustomFields().pipe(
        map((clients: Client[]) => new LoadClientsSuccess(clients)),
        catchError(error => of(new LoadClientsFailure()))
      )
    )
  );

  @Effect()
  LoadSingleClient$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadSingleClient),
    map((action: LoadSingleClient) => action),
    switchMap((data: any) =>
      this.clientService.getClientInfo(data.payload).pipe(
        map(
          (response: any) =>
            new LoadSingleClientSuccess({...response, ClientId: data.payload, target: 'all'})
        ),
        catchError(error => of(new LoadSingleClientFailure()))
      )
    )
  );

  @Effect()
  UpdateSingleClient$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateSingleClient),
    map((action: UpdateSingleClient) => action),
    switchMap((data: any) =>
      this.clientService.updateClientData(data.payload.ClientId, data.payload.data).pipe(
        map((personaldata: any) => {
          this.notifierService.notify('success', 'Client has been successfully updated');
          return new UpdateSingleClientSuccess({
            personaldata,
            ClientId: data.payload.ClientId,
            target: 'personaldata',
            action: 'update'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update client');
          return of(new UpdateSingleClientFailure());
        })
      )
    )
  );

  @Effect()
  CreateSingleClient$ = this.actions$.pipe(
    ofType(ClientActionTypes.CreateSingleClient),
    map((action: CreateSingleClient) => action),
    switchMap((data: any) =>
      this.clientService.postAddClientData(data.payload.data).pipe(
        map((personaldata: any) => {
          this.notifierService.notify('success', 'Client has been successfully created');
          return new CreateSingleClientSuccess({
            personaldata,
            ClientId: personaldata.ClientId,
            target: 'personaldata',
            action: 'create'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to created client');
          return of(new CreateSingleClientFailure());
        })
      )
    )
  );

  @Effect()
  LoadClientReminders$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClientReminders),
    map((action: LoadClientReminders) => action),
    switchMap((data: any) =>
      this.clientService.getReminders(data.payload).pipe(
        map(
          (reminders: any[]) =>
            new LoadClientRemindersSuccess({reminders, ClientId: data.payload, target: 'reminders'})
        ),
        catchError(error => of(new LoadClientRemindersFailure()))
      )
    )
  );

  @Effect()
  CreateClientReminders$ = this.actions$.pipe(
    ofType(ClientActionTypes.CreateClientReminders),
    map((action: CreateClientReminders) => action),
    switchMap((data: any) =>
      this.clientService.createReminder(data.payload.ClientId, data.payload.data).pipe(
        map((reminder: any) => {
          this.notifierService.notify('success', 'Reminder has been successfully created');
          return new CreateClientRemindersSuccess({
            data: reminder,
            ClientId: data.payload.ClientId,
            action: 'create',
            target: 'reminders'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update reminder');
          return of(new CreateClientRemindersFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientReminders$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientReminders),
    map((action: UpdateClientReminders) => action),
    switchMap((data: any) =>
      this.clientService
        .updateReminder(data.payload.ClientId, data.payload.ExpirationID, data.payload.data)
        .pipe(
          map((reminder: any) => {
            this.notifierService.notify('success', 'Reminder has been successfully updated');
            return new UpdateClientRemindersSuccess({
              data: reminder,
              ClientId: data.payload.ClientId,
              action: 'update',
              target: 'reminders',
              idField: 'ExpirationID'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update reminder');
            return of(new UpdateClientRemindersFailure());
          })
        )
    )
  );

  @Effect()
  DeleteClientReminders$ = this.actions$.pipe(
    ofType(ClientActionTypes.DeleteClientReminders),
    map((action: DeleteClientReminders) => action),
    switchMap((data: any) =>
      this.clientService.deleteReminder(data.payload.ClientId, data.payload.ExpirationID).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Reminder has been successfully deleted');
          return new DeleteClientRemindersSuccess({
            ClientId: data.payload.ClientId,
            action: 'delete',
            data: data.payload,
            target: 'reminders',
            idField: 'ExpirationID'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to delete reminder');
          return of(new DeleteClientRemindersFailure());
        })
      )
    )
  );

  // Attachments
  @Effect()
  LoadClientAttachments$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClientAttachments),
    map((action: LoadClientAttachments) => action),
    switchMap((data: any) =>
      this.clientService.getAttachmentData(data.payload).pipe(
        map(
          (attachments: any[]) =>
            new LoadClientAttachmentsSuccess({
              attachments,
              ClientId: data.payload,
              target: 'attachments'
            })
        ),
        catchError(error => of(new LoadClientAttachmentsFailure()))
      )
    )
  );

  @Effect()
  CreateClientAttachments$ = this.actions$.pipe(
    ofType(ClientActionTypes.CreateClientAttachments),
    map((action: CreateClientAttachments) => action),
    switchMap((data: any) =>
      this.clientService.createAttachment(data.payload.ClientId, data.payload.data).pipe(
        map((attachment: any) => {
          this.notifierService.notify('success', 'Attachment has been successfully created');
          return new CreateClientAttachmentsSuccess({
            data: attachment,
            ClientId: data.payload.ClientId,
            action: 'create',
            target: 'attachments'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update attachment');
          return of(new CreateClientAttachmentsFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientAttachments$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientAttachments),
    map((action: UpdateClientAttachments) => action),
    switchMap((data: any) =>
      this.clientService
        .updateAttachment(data.payload.ClientId, data.payload.attachmentId, data.payload.data)
        .pipe(
          map((attachment: any) => {
            this.notifierService.notify('success', 'Attachment has been successfully updated');
            return new UpdateClientAttachmentsSuccess({
              data: attachment,
              ClientId: data.payload.ClientId,
              action: 'update',
              target: 'attachments',
              idField: 'attachmentId'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update attachment');
            return of(new UpdateClientAttachmentsFailure());
          })
        )
    )
  );

  @Effect()
  DeleteClientAttachments$ = this.actions$.pipe(
    ofType(ClientActionTypes.DeleteClientAttachments),
    map((action: DeleteClientAttachments) => action),
    switchMap((data: any) =>
      this.clientService.deleteAattachment(data.payload.ClientId, data.payload.attachmentId).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Attachment has been successfully deleted');
          return new DeleteClientAttachmentsSuccess({
            ClientId: data.payload.ClientId,
            action: 'delete',
            data: data.payload,
            target: 'attachments',
            idField: 'attachmentId'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to delete attachment');
          return of(new DeleteClientAttachmentsFailure());
        })
      )
    )
  );

  @Effect()
  LoadClientContacts$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClientContacts),
    map((action: LoadClientContacts) => action),
    switchMap((data: any) =>
      this.clientService.getContactDetails(data.payload).pipe(
        map((contacts: any[]) => new LoadClientContactsSuccess({contacts, ClientId: data.payload})),
        catchError(error => of(new LoadClientContactsFailure()))
      )
    )
  );

  @Effect()
  CreateClientContacts$ = this.actions$.pipe(
    ofType(ClientActionTypes.CreateClientContacts),
    map((action: CreateClientContacts) => action),
    switchMap((data: any) =>
      this.clientService.createContact(data.payload.ClientId, data.payload.data).pipe(
        map((contact: any) => {
          this.notifierService.notify('success', 'Contact has been successfully created');
          return new CreateClientContactsSuccess({
            data: contact,
            ClientId: data.payload.ClientId,
            action: 'create',
            target: 'contacts'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update contact');
          return of(new CreateClientContactsFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientContacts$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientContacts),
    map((action: UpdateClientContacts) => action),
    switchMap((data: any) =>
      this.clientService
        .updateContact(data.payload.ClientId, data.payload.ContactID, data.payload.data)
        .pipe(
          map((contact: any) => {
            this.notifierService.notify('success', 'Contact has been successfully updated');
            return new UpdateClientContactsSuccess({
              data: contact,
              ClientId: data.payload.ClientId,
              action: 'update',
              target: 'contacts',
              idField: 'ContactID'
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to update Contact');
            return of(new UpdateClientContactsFailure());
          })
        )
    )
  );

  @Effect()
  DeleteClientContacts$ = this.actions$.pipe(
    ofType(ClientActionTypes.DeleteClientContacts),
    map((action: DeleteClientContacts) => action),
    switchMap((data: any) =>
      this.clientService.deleteContact(data.payload.ClientId, data.payload.ContactID).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Contact has been successfully deleted');
          return new DeleteClientContactsSuccess({
            ClientId: data.payload.ClientId,
            action: 'delete',
            data: data.payload,
            target: 'contacts',
            idField: 'ContactID'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to delete Contact');
          return of(new DeleteClientContactsFailure());
        })
      )
    )
  );

  @Effect()
  LoadClientCustomFields$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClientCustomFields),
    map((action: LoadClientCustomFields) => action),
    switchMap((data: any) =>
      this.clientService.getCustomFields(data.payload).pipe(
        map(
          (customfields: any[]) =>
            new LoadClientCustomFieldsSuccess({customfields, ClientId: data.payload})
        ),
        catchError(error => of(new LoadClientCustomFieldsFailure()))
      )
    )
  );

  @Effect()
  UpdateClientCustomFields$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientCustomFields),
    map((action: UpdateClientCustomFields) => action),
    switchMap((data: any) =>
      this.clientService.updateCustomField(data.payload.ClientId, data.payload.data).pipe(
        map((CustomField: any) => {
          this.notifierService.notify('success', 'Custom Field has been successfully updated');
          return new UpdateClientCustomFieldsSuccess({
            data: CustomField,
            ClientId: data.payload.ClientId,
            action: 'create-update',
            target: 'customfields',
            idField: 'cfieldName'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update Custom Field');
          return of(new UpdateClientCustomFieldsFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientCustomFieldsAll$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientCustomFieldsAll),
    map((action: UpdateClientCustomFieldsAll) => action),
    switchMap((data: any) =>
      this.clientService.updateCustomFieldAll(data.payload.ClientId, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Custom Field has been successfully updated');
          return new UpdateClientCustomFieldsAllSuccess({
            ...response,
            ClientId: data.payload.ClientId
            // data: CustomField,
            // ClientId: data.payload.ClientId,
            // action: 'create-update',
            // target: 'customfields',
            // idField: 'cfieldName'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update Custom Field');
          return of(new UpdateClientCustomFieldsAllFailure());
        })
      )
    )
  );

  @Effect()
  LoadClientNotes$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClientNotes),
    map((action: LoadClientNotes) => action),
    switchMap((data: any) =>
      this.clientService.getAllNotes(data.payload).pipe(
        map(
          (notes: any[]) =>
            new LoadClientNotesSuccess({notes, ClientId: data.payload, target: 'notes'})
        ),
        catchError(error => of(new LoadClientNotesFailure()))
      )
    )
  );

  @Effect()
  CreateClientNotes$ = this.actions$.pipe(
    ofType(ClientActionTypes.CreateClientNotes),
    map((action: CreateClientNotes) => action),
    switchMap((data: any) =>
      this.clientService.createNote(data.payload.ClientId, data.payload.data).pipe(
        map((note: any) => {
          this.notifierService.notify('success', 'Note has been successfully created');
          return new CreateClientNotesSuccess({
            data: note,
            ClientId: data.payload.ClientId,
            action: 'create',
            target: 'notes'
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update Note');
          return of(new CreateClientNotesFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientNotes$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientNotes),
    map((action: UpdateClientNotes) => action),
    switchMap((data: any) =>
      this.clientService
        .updateNote(
          data.payload.ClientId,
          data.payload.NoteDate,
          data.payload.NoteTime,
          data.payload.data
        )
        .pipe(
          map((note: any) => {
            this.notifierService.notify('success', 'Note has been successfully updated');
            return new UpdateClientNotesSuccess({
              data: note,
              ClientId: data.payload.ClientId,
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
            return of(new UpdateClientNotesFailure());
          })
        )
    )
  );

  @Effect()
  DeleteClientNotes$ = this.actions$.pipe(
    ofType(ClientActionTypes.DeleteClientNotes),
    map((action: DeleteClientNotes) => action),
    switchMap((data: any) =>
      this.clientService
        .deleteNote(data.payload.ClientId, data.payload.NoteDate, data.payload.NoteTime)
        .pipe(
          map((response: any) => {
            this.notifierService.notify('success', 'Note has been successfully deleted');
            return new DeleteClientNotesSuccess({
              ClientId: data.payload.ClientId,
              action: 'delete',
              data: data.payload,
              target: 'notes',
              idField: ['NoteDate', 'NoteTime']
            });
          }),
          catchError(error => {
            this.notifierService.notify('error', 'Failed to delete Note');
            return of(new DeleteClientNotesFailure());
          })
        )
    )
  );

  @Effect()
  LoadClientVisits$ = this.actions$.pipe(
    ofType(ClientActionTypes.LoadClientVisits),
    map((action: LoadClientVisits) => action),
    switchMap((data: any) =>
      this.clientService.getVisitHistory(data.payload).pipe(
        map(
          (visits: any[]) =>
            new LoadClientVisitsSuccess({visits, ClientId: data.payload, target: 'visits'})
        ),
        catchError(error => of(new LoadClientVisitsFailure()))
      )
    )
  );

  @Effect()
  UpdateClientSkills$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientSkills),
    map((action: UpdateClientSkills) => action),
    switchMap((data: any) =>
      this.clientService.updateSkills(data.payload.ClientId, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Skills has been successfully updated');
          return new UpdateClientSkillsSuccess({
            ...response,
            ClientId: data.payload.ClientId
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update skills');
          return of(new UpdateClientSkillsFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientLanguages$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientLanguages),
    map((action: UpdateClientLanguages) => action),
    switchMap((data: any) =>
      this.clientService.updateLanguages(data.payload.ClientId, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Languages has been successfully updated');
          return new UpdateClientLanguagesSuccess({
            ...response,
            ClientId: data.payload.ClientId
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update languages');
          return of(new UpdateClientLanguagesFailure());
        })
      )
    )
  );

  @Effect()
  UpdateClientAvailabilities$ = this.actions$.pipe(
    ofType(ClientActionTypes.UpdateClientAvailabilities),
    map((action: UpdateClientAvailabilities) => action),
    switchMap((data: any) =>
      this.clientService.updateAvailabilities(data.payload.ClientId, data.payload.data).pipe(
        map((response: any) => {
          this.notifierService.notify('success', 'Availability has been successfully updated');
          return new UpdateClientAvailabilitiesSuccess({
            ...response,
            ClientId: data.payload.ClientId
          });
        }),
        catchError(error => {
          this.notifierService.notify('error', 'Failed to update availabilities');
          return of(new UpdateClientAvailabilitiesFailure());
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private clientService: ClientService,
    private notifierService: NotifierService
  ) {}
}
