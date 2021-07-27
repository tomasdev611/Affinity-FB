import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/gaurd/auth.service';

@Component({
  selector: 'caregiver-overview-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class OverviewRemindersComponent implements OnInit {
  @Input() reminders: [];

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';

  acl_allow = {read: false, update: false, delete: false};

  ngAfterViewChecked() {}

  constructor(private router: Router, private authService: AuthService) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {}

  openManageReminders(content) {
    content.show();
  }

  ngOnDestroy() {}
}
