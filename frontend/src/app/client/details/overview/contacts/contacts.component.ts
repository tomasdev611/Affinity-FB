import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../../services/gaurd/auth.service';

@Component({
  selector: 'client-overview-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class OverviewContactsComponent implements OnInit {
  @Input() contacts: [];

  check_access_on_init = true;
  access_group_id = 'Client Data';

  acl_allow = {read: false, update: false, delete: false};

  ngAfterViewChecked() {}

  constructor(private router: Router, private authService: AuthService) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
    }
  }

  ngOnInit() {}

  // for update Contact
  openManageContacts(content) {
    content.show();
  }

  ngOnDestroy() {}
}
