import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {pick} from 'lodash';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  LoadClientAttachments,
  CreateClientAttachments,
  UpdateClientAttachments,
  DeleteClientAttachments
} from '../../../states/actions/client.actions';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {AuthService} from '../../../services/gaurd/auth.service';
import {ClientService} from '../../../services/db/client.service';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';

const EmptyAttachment = {
  descr: ''
};

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  clientDetail: any;
  saving: string = '';
  ClientId: string;

  activeModal: ModalComponent;

  // for store attachment data
  attachmentDetails = [];

  attachment = {...EmptyAttachment};

  fileSelected: boolean = false;
  filesToUpload: Array<File>;

  attachmentId: any;

  check_access_on_init = true;
  access_group_id = 'Client Data';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private store: Store<any>
  ) {
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
          this.store.dispatch(new LoadClientAttachments(data.currentClientId));
        }
        this.ClientId = data.currentClientId;
        this.clientDetail = data[this.ClientId];
        if (this.clientDetail) {
          if (this.clientDetail.attachments) {
            this.attachmentDetails = this.clientDetail.attachments.map(attachment => ({
              ...attachment,
              str_filename: attachment.str_filename ? environment.aws + attachment.str_filename : ''
            }));
          } else {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadClientAttachments(this.ClientId));
            }
          }
        }
      });
  }

  readUrl(event: any) {
    this.filesToUpload = <Array<File>>event.target.files;
    this.fileSelected = true;
  }

  SendAattachment() {
    let file = this.filesToUpload[0];
    var extension = file.name.substr(file.name.length - 4);
    let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
    var formData: any = new FormData();
    formData.append('descr', this.attachment.descr);
    formData.append('file', file, img_text);
    this.store.dispatch(
      new CreateClientAttachments({
        ClientId: this.ClientId,
        data: formData
      })
    );
  }

  // open model for attachment
  newAttachmentAction(content) {
    this.attachment = {...EmptyAttachment};
    this.fileSelected = false;
    this.attachmentId = null;
    this.filesToUpload = [];
    content.show();
    this.activeModal = content;
  }

  // Feb-12
  // open model for Update Attachment
  AttachmentUpdateAction(content, row) {
    this.attachment = pick(row, ['descr']);
    this.filesToUpload = [];
    this.attachmentId = row.attachmentId;
    content.show();
    this.activeModal = content;
  }

  // for update attachment on server
  updateAttachment() {
    var formData: any = new FormData();
    formData.append('descr', this.attachment.descr);
    if (this.filesToUpload && this.filesToUpload.length > 0) {
      let file = this.filesToUpload[0];
      var extension = file.name.substr(file.name.length - 4);
      let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
      formData.append('file', file, img_text);
    }
    this.store.dispatch(
      new UpdateClientAttachments({
        ClientId: this.ClientId,
        attachmentId: this.attachmentId,
        data: formData
      })
    );
  }

  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: 'application/pdf'});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  downloadAttachment(row) {
    // this.saveByteArray(`${row.attachmentId}_${row.descr}.pdf`, new Uint8Array(row.attachment.data));
    try {
      this.clientService.downloadAttachment(this.ClientId, row.attachmentId).subscribe(response => {
        const {attachment} = response;
        this.saveByteArray(
          `${row.attachmentId}_${row.descr}.pdf`,
          new Uint8Array(attachment.attachment.data)
        );
      });
    } catch (error) {
      console.error(error);
    }
  }

  SaveAttachment() {
    if (this.attachmentId) {
      this.updateAttachment();
    } else {
      this.SendAattachment();
    }
  }

  // for delete attachment
  deleteAattachment() {
    this.store.dispatch(
      new DeleteClientAttachments({
        ClientId: this.ClientId,
        attachmentId: this.attachmentId
      })
    );
  }

  // open model for Update Attachment
  AttachmentDeleteAction(content, row) {
    this.attachmentId = row.attachmentId;
    content.show();
    this.activeModal = content;
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
