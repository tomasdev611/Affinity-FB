import {Component, OnInit} from '@angular/core';
import cidrRegex from 'cidr-regex';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {SettingsService} from '../../../services/settings/settings.service';
import {AuthService} from '../../../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {cloneDeep, omit} from 'lodash';
import {NotifierService} from 'angular-notifier';
import {select, Store} from '@ngrx/store';
import {COMMON_OMIT_FIELD} from '../../../common/default';

const DEFAULT_DATA = {
  name: '',
  IpCIDR: '',
  isActive: true
};

const OMIT_FIELDS = [...COMMON_OMIT_FIELD];

const DEFAULT_SETTING = {
  securityOn: false,
  ReadOnlyNotes: false,
  inactivityTimeout: 60
};

@Component({
  selector: 'app-general-access',
  templateUrl: './general-access.component.html',
  styleUrls: ['./general-access.component.scss']
})
export class GeneralAccessComponent implements OnInit {
  listData = []; // for list

  editRow: any;
  editData: any;

  saving: string = '';
  loading: boolean = false;

  selected: any = {
    ...DEFAULT_SETTING
  };

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};

  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private location: Location,
    private store: Store<any>,
    private authService: AuthService,
    private notifierService: NotifierService
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
        return;
      }
    }
    this.fetchSettingData();
  }

  ngOnInit() {
    // let link = this.location.path();
    // this.authService.checkAndAddLink({
    //   link,
    //   title: 'Reminders',
    //   type: 'admin',
    //   canClose: true
    // });
    this.fetchIpTables();
  }

  //calls the api to fetch data for selected item : Varun
  fetchSettingData() {
    var auth_token = localStorage.getItem('auth_token');

    this.loading = true;
    this.settingsService.getCompanySettings(auth_token).subscribe(
      data => {
        this.selected = {
          ...data
        };
        this.loading = false;
      },
      err => {
        this.loading = false;
        console.error(err);
      }
    );
  }

  fetchIpTables() {
    this.settingsService.getIpRecords().subscribe(
      data => {
        this.listData = data.records;
      },
      err => {}
    );
  }

  //function to update the data
  updateSettingData() {
    this.saving = 'saving';
    this.settingsService.updateCompanySettings(this.selected).subscribe(
      data => {
        this.saving = 'success';
      },
      err => {
        this.saving = 'false';
        console.error(err);
      }
    );
  }

  addDataAction(content) {
    this.editRow = null;
    this.editData = cloneDeep(DEFAULT_DATA);
    content.show();
  }

  updateDataAction(content, row) {
    this.editRow = row;
    this.editData = cloneDeep(omit(row, OMIT_FIELDS));
    content.show();
  }

  deleteDataAction(content, row) {
    this.editRow = row;
    content.show();
  }

  saveData(content) {
    if (this.editRow) {
      this.updateData(content);
    } else {
      this.addNewData(content);
    }
  }

  async addNewData(content) {
    try {
      if (!cidrRegex({exact: true}).test(this.editData.IpCIDR)) {
        this.notifierService.notify('error', 'Invalid CIDR');
        return;
      }
      this.saving = 'saving';

      await this.settingsService.createIpTable(this.editData).subscribe(
        data => {
          content.hide();
          this.listData = [data.record, ...this.listData];
          this.saving = 'false';
        },
        err => {
          this.saving = 'false';
          console.error(err);
        }
      );
    } catch (error) {
      console.error('Error-', error);
      this.saving = `error`;
    }
  }

  async updateData(content) {
    try {
      if (!cidrRegex({exact: true}).test(this.editData.IpCIDR)) {
        this.notifierService.notify('error', 'Invalid CIDR');
        return;
      }
      this.saving = 'saving';
      await this.settingsService.updateSingleIpRecord(this.editRow.id, this.editData).subscribe(
        data => {
          content.hide();
          this.listData = this.listData.map(l => (l.id === data.record.id ? data.record : l));
          this.saving = 'false';
        },
        err => {
          this.saving = 'false';
          console.error(err);
        }
      );
    } catch (error) {
      console.error('H--', error);
      this.saving = `error`;
    }
  }

  async deleteData(content) {
    try {
      this.saving = 'saving';
      await this.settingsService.deleteIpRecord(this.editRow.id).subscribe(
        data => {
          content.hide();
          this.listData = this.listData.filter(l => l.id !== this.editRow.id);
          this.saving = 'false';
        },
        err => {
          this.saving = 'false';
          console.error(err);
        }
      );
    } catch (error) {
      console.error(error);
      this.saving = `error`;
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
