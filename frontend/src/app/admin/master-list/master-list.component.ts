import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/gaurd/auth.service';
import {MasterformService} from '../../services/db/masterform.service';
import {Location} from '@angular/common';
import {NotifierService} from 'angular-notifier';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.css']
})
export class MasterListComponent implements OnInit {
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};
  saving: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private masterformService: MasterformService,
    private notifierService: NotifierService
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = this.authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  ngOnInit() {}

  runCaregiverPhoneJob() {
    this.saving = true;
    this.notifierService.notify('info', 'Caregiver phone formatting job is in progress');
    this.masterformService.runCaregiverPhoneJob().subscribe(() => {
      this.saving = false;
      this.notifierService.notify('info', 'Caregiver phone formatting job complete');
    });
  }
}
