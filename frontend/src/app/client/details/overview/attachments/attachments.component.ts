import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/gaurd/auth.service';
import {ClientService} from '../../../../services/db/client.service';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'client-overview-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class OverviewAttachmentsComponent implements OnInit {
  @Input() attachments: [];
  selectedAttachment: any = '';

  check_access_on_init = true;
  access_group_id = 'Client Data';

  acl_allow = {read: false, update: false, delete: false};

  ngAfterViewChecked() {}

  constructor(
    private router: Router,
    private clientService: ClientService,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {}

  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: 'application/pdf'});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  downloadAttachments() {
    if (!this.selectedAttachment) {
      this.notifierService.notify('error', 'Please select attachment');
      return;
    }
    const row: any = this.attachments.find((t: any) => (t.attachmentId = this.selectedAttachment));
    try {
      this.clientService.downloadAttachment(row.clientID, row.attachmentId).subscribe(response => {
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

  ngOnDestroy() {}
}
