import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {pick} from 'lodash';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  LoadCaregiverAttachments,
  CreateCaregiverAttachments,
  UpdateCaregiverAttachments,
  DeleteCaregiverAttachments
} from '../../../states/actions/caregiver.actions';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {AuthService} from '../../../services/gaurd/auth.service';
import * as fromRoot from '../../../states/reducers';
import {CACHE_ENABLED} from '../../../config';
import {CaregiverService} from '../../../services/db/caregiver.service';

const EmptyAttachment = {
  descr: ''
};

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  caregiverDetail: any;
  saving: string = '';
  SocialSecurityNum: string;

  activeModal: ModalComponent;
  // for store attachment data
  attachmentDetails = [];

  attachment = {...EmptyAttachment};

  fileSelected: boolean = false;
  filesToUpload: Array<File>;

  attachmentId: any;

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngAfterViewChecked() {}

  constructor(
    private authService: AuthService,
    private caregiverService: CaregiverService,
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
          this.store.dispatch(new LoadCaregiverAttachments(data.currentCaregiverSocialSecurityNum));
        }
        this.SocialSecurityNum = data.currentCaregiverSocialSecurityNum;
        this.caregiverDetail = data[this.SocialSecurityNum];
        if (this.caregiverDetail) {
          if (this.caregiverDetail.attachments) {
            this.attachmentDetails = this.caregiverDetail.attachments.map(attachment => ({
              ...attachment,
              str_filename: attachment.str_filename ? environment.aws + attachment.str_filename : ''
            }));
          } else {
            if (CACHE_ENABLED) {
              this.store.dispatch(new LoadCaregiverAttachments(this.SocialSecurityNum));
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
      new CreateCaregiverAttachments({
        SocialSecurityNum: this.SocialSecurityNum,
        data: formData
      })
    );
  }

  // open model for attachment
  newAttachmentAction(content) {
    this.attachment = {...EmptyAttachment};
    this.fileSelected = false;
    this.filesToUpload = [];
    this.attachmentId = null;
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
      new UpdateCaregiverAttachments({
        SocialSecurityNum: this.SocialSecurityNum,
        attachmentId: this.attachmentId,
        data: formData
      })
    );
  }

  SaveAttachment() {
    if (this.attachmentId) {
      this.updateAttachment();
    } else {
      this.SendAattachment();
    }
  }

  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: 'application/pdf'});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  async downloadAttachment(row) {
    try {
      this.caregiverService
        .downloadAttachment(row.socialSecNum, row.attachmentId)
        .subscribe(response => {
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

  deleteAattachment() {
    this.store.dispatch(
      new DeleteCaregiverAttachments({
        SocialSecurityNum: this.SocialSecurityNum,
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
