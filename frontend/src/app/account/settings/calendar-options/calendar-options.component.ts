import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './calendar-options.component.html',
  styleUrls: ['./calendar-options.component.scss']
})
export class CalendarOptionsComponent implements OnInit {
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};

  constructor(private router: Router) {}

  ngOnInit() {}
}
