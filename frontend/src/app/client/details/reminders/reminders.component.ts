import {Component, OnInit} from '@angular/core';
import {pick} from 'lodash';
import {select, Store} from '@ngrx/store';
import {AuthService} from '../../../services/gaurd/auth.service';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  LoadClientReminders,
  UpdateClientReminders,
  CreateClientReminders,
  DeleteClientReminders
} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

const EmptyReminder = {
  description: '',
  expirationDate: '',
  Notes: '',
  ReminderOn: false
};

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {
  clientDetail: any;

  saving: string = '';
  ClientId: string;
  ExpirationID: any;

  reminderData = [];

  reminder = {...EmptyReminder};
  activeModal: ModalComponent;

  reminderDescriptionData = [];

  check_access_on_init = true;
  access_group_id = 'Client Data';
  acl_allow = {read: false, update: false, delete: false};

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(private authService: AuthService, private store: Store<any>) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.reminderDescriptionData = data.reminderDescriptions.filter(rd => rd.client);
        }
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientSaving)
      )
      .subscribe(data => {
        if (this.saving === 'saving' && data === 'success') {
          if (this.activeModal) {
            this.activeModal.hide();
            this.activeModal = null;
          }
        }
        this.saving = data;
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        if (!CACHE_ENABLED && this.ClientId !== data.currentClientId) {
          this.store.dispatch(new LoadClientReminders(data.currentClientId));
        }
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          this.reminderData = this.clientDetail.reminders;
          if (!this.reminderData && CACHE_ENABLED) {
            this.store.dispatch(new LoadClientReminders(this.ClientId));
          }
        }
      });
  }

  ReminderUpdateAction(content, row) {
    this.ExpirationID = row.ExpirationID;
    this.reminder = pick(row, ['description', 'Notes', 'ReminderOn', 'expirationDate']);
    content.show();
    this.activeModal = content;
  }

  updateReminder() {
    this.store.dispatch(
      new UpdateClientReminders({
        ClientId: this.ClientId,
        ExpirationID: this.ExpirationID,
        data: this.reminder
      })
    );
  }

  newReminderAction(content) {
    // for convert data and set current date
    var todayDate = new Date().toISOString();
    this.reminder = {...EmptyReminder};
    this.ExpirationID = null;
    this.reminder.expirationDate = todayDate.substring(0, 10);
    content.show();
    this.activeModal = content;
  }

  // post the new reminder data on submit
  createReminder() {
    this.store.dispatch(
      new CreateClientReminders({
        ClientId: this.ClientId,
        data: this.reminder
      })
    );
  }

  saveReminder() {
    if (this.ExpirationID) {
      this.updateReminder();
    } else {
      this.createReminder();
    }
  }

  // open model for delete reminder
  ReminderDeleteAction(content, row) {
    this.ExpirationID = row.ExpirationID;
    this.reminder = row;
    content.show();
    this.activeModal = content;
  }

  deleteReminder() {
    this.store.dispatch(
      new DeleteClientReminders({
        ClientId: this.ClientId,
        ExpirationID: this.ExpirationID
      })
    );
  }

  // for closing the modal when move another component
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
