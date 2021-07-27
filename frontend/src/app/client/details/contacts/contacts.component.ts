import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {pick} from 'lodash';
import {AuthService} from '../../../services/gaurd/auth.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {
  LoadClientContacts,
  CreateClientContacts,
  DeleteClientContacts,
  UpdateClientContacts
} from '../../../states/actions/client.actions';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

const EmptyContact = {
  Name: '',
  ContactEmail: '',
  OtherContactInfo: '',
  Phone: '',
  Fax: ''
};

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  clientDetail: any;

  ContactID: any;
  ClientId: string;
  saving: string = '';

  contactDetails = []; // for store client contacts

  contact = {
    ...EmptyContact
  };

  activeModal: ModalComponent;

  check_access_on_init = true;
  access_group_id = 'Client Data';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(private authService: AuthService, private store: Store<any>) {
    // this.showAddClientButton = this.dataService.addClient;
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {
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
          this.store.dispatch(new LoadClientContacts(data.currentClientId));
        }
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          this.contactDetails = this.clientDetail.contacts;
          if (!this.contactDetails && CACHE_ENABLED) {
            this.store.dispatch(new LoadClientContacts(this.ClientId));
          }
        }
      });
  }

  newContactAction(content) {
    this.contact = {...EmptyContact};
    this.ContactID = null;
    content.show();
    this.activeModal = content;
  }

  createContact() {
    this.store.dispatch(
      new CreateClientContacts({
        ClientId: this.ClientId,
        data: this.contact
      })
    );
  }

  updateContactAction(content, row) {
    this.ContactID = row.ContactID;
    this.contact = pick(row, ['Name', 'ContactEmail', 'OtherContactInfo', 'Phone', 'Fax']);
    content.show();
    this.activeModal = content;
  }

  updateContact() {
    this.store.dispatch(
      new UpdateClientContacts({
        ClientId: this.ClientId,
        ContactID: this.ContactID,
        data: this.contact
      })
    );
  }

  saveContact() {
    if (this.ContactID) {
      this.updateContact();
    } else {
      this.createContact();
    }
  }

  contactDeleteAction(content, row) {
    this.ContactID = row.ContactID;
    this.contact = row;
    content.show();
    this.activeModal = content;
  }

  deleteContact() {
    this.store.dispatch(
      new DeleteClientContacts({
        ClientId: this.ClientId,
        ContactID: this.ContactID
      })
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
