import {Component, OnInit} from '@angular/core';
import {pick} from 'lodash';
import {select, Store} from '@ngrx/store';
import {AuthService} from '../../../services/gaurd/auth.service';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  LoadCaregiverReminders,
  UpdateCaregiverReminders,
  CreateCaregiverReminders,
  DeleteCaregiverReminders
} from '../../../states/actions/caregiver.actions';
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
  caregiverDetail: any;

  saving: string = '';
  SocialSecurityNum: string;
  ExpirationID: any;

  reminderData = [];
  activeModal: ModalComponent;

  reminder = {...EmptyReminder};

  reminderDescriptionData = [];

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';
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
          this.reminderDescriptionData = data.reminderDescriptions.filter(rd => rd.caregivers);
        }
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCaregiverSaving)
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
        select(fromRoot.getCaregiverDetailMap)
      )
      .subscribe(data => {
        if (!CACHE_ENABLED && this.SocialSecurityNum !== data.currentCaregiverSocialSecurityNum) {
          this.store.dispatch(new LoadCaregiverReminders(data.currentCaregiverSocialSecurityNum));
        }
        this.SocialSecurityNum = data.currentCaregiverSocialSecurityNum;
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          this.reminderData = this.caregiverDetail.reminders;
          if (!this.reminderData && CACHE_ENABLED) {
            this.store.dispatch(new LoadCaregiverReminders(this.SocialSecurityNum));
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
      new UpdateCaregiverReminders({
        SocialSecurityNum: this.SocialSecurityNum,
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
      new CreateCaregiverReminders({
        SocialSecurityNum: this.SocialSecurityNum,
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
      new DeleteCaregiverReminders({
        SocialSecurityNum: this.SocialSecurityNum,
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
