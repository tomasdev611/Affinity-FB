import {Component, OnInit} from '@angular/core';
import {cloneDeep, pick} from 'lodash';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {ModalComponent} from '../../../library/custom-modal/modal/modal.component';
import {SettingsService} from '../../../services/settings/settings.service';
import {AuthService} from '../../../services/gaurd/auth.service';

import {placeholderChars, alphabetic, digit} from '../../constants';

import * as fromRoot from '../../../states/reducers';
import {
  SetCurrentUserUserName,
  UpdateSingleUser,
  CreateSingleUser,
  LoadSingleUser,
  DeleteSingleUser,
  LoadUsers,
  UpdateSingleUserPassword
} from '../../../states/actions/user.actions';

const defaultValues = {
  placeholderChar: placeholderChars.whitespace,
  guide: true,
  pipe: null,
  keepCharPositions: false,
  help: null,
  placeholder: null
};

const DEAFULT_USER = {
  userName: '',
  str_email: '',
  userPassword: '',
  enabled: false
};
const DEFAULT_USER_INFO = {
  securityGroups: [],
  classes: [],
  userName: '',
  locations: []
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  securityGroups = [];
  classesNames = [];

  loadUsersCalled = false;

  saving: string = '';
  loading: boolean = false;
  // drop down securityUsername for access

  securityusers = [];
  selected: any = {
    ...DEFAULT_USER_INFO
  };

  userDetail: any;
  userName: any;

  selectedRow: any;

  newUser = {...DEAFULT_USER};

  NewPassword: any;

  // for add new location
  newLocation: any;
  checkTab: boolean = true;

  toggle: any;
  //to manage the enable and disable button
  isUserEnabled: boolean = true;
  isResetEnabled: boolean = true;

  activeModal: ModalComponent;

  selectedUserName: string; // for selected user name from drop down list

  locationID: any; // for get location id

  userFormatMatches = (value: any) => value.name || '';
  clientFormatMatches = (value: any) => value.name || '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  check_access_on_init = true;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};
  constructor(
    private router: Router,
    private settingsService: SettingsService,
    private authService: AuthService,
    private store: Store<any>
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  ngOnInit() {
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getUserSaving)
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
        select(fromRoot.getUserLoading)
      )
      .subscribe(data => {
        this.loading = data;
      });
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          this.securityGroups = data.securityGroups;
          this.classesNames = data.classesNames;
        }
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getUsers)
      )
      .subscribe(data => {
        if (data.length === 0 && !this.loadUsersCalled) {
          this.loadUsersCalled = true;
          this.store.dispatch(new LoadUsers());
        }
        this.securityusers = data;
      });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getUserDetailMap)
      )
      .subscribe(data => {
        if (this.selectedUserName !== data.currentUserUserName) {
          this.userDetail = null;
          this.selected = cloneDeep(DEFAULT_USER_INFO);
        }

        this.selectedUserName = data.currentUserUserName;
        if (this.selectedUserName) {
          this.userDetail = data[this.selectedUserName];
          if (!this.userDetail.personaldata || !this.userDetail.securityGroups) {
            this.store.dispatch(new LoadSingleUser(this.selectedUserName));
          } else {
            this.selected = this.generateUserDetailForEdit(this.userDetail);
          }
        }
      });
    // this.fetchSettingData();
  }

  // setAllChecked() {
  //   if (this.selected.classes.length === this.classesNames.length) {
  //     this.
  //   }
  // }

  generateUserDetailForEdit(data) {
    let editData = cloneDeep(data);
    editData.securityGroups = this.securityGroups.map(sg => {
      let userSecurity = editData.securityGroups.find(usg => usg.GroupId === sg.GroupId) || {
        bit_read: false,
        bit_update: false,
        bit_delete: false
      };
      return {
        Descr: sg.Descr,
        GroupId: sg.GroupId,
        ...userSecurity
      };
    });
    return editData;
  }

  onAllCheckboxClass(event) {
    if (event.target.checked) {
      // this.selected.classes.push(rowInfo.className);
      this.selected.classes = this.classesNames.map(c => c.className);
    } else {
      // this.selected.classes = this.selected.classes.filter(c => c !== rowInfo.className);
      this.selected.classes = [];
    }
  }

  onCheckboxClass(rowInfo, event) {
    if (event.target.checked) {
      this.selected.classes.push(rowInfo.className);
    } else {
      this.selected.classes = this.selected.classes.filter(c => c !== rowInfo.className);
    }
  }

  creatLogin(content) {
    this.newUser = {...DEAFULT_USER};
    content.show();
    this.activeModal = content;
  }

  editUser(user, content) {
    this.selectedRow = user;
    this.store.dispatch(new SetCurrentUserUserName(user.userName));
    content.show();
    this.activeModal = content;
  }

  resetPassword(row, content) {
    this.selectedRow = row;
    content.show();
    this.activeModal = content;
  }

  deleteUserAction(row, content) {
    this.selectedRow = row;
    content.show();
    this.activeModal = content;
  }

  createNewUser() {
    this.store.dispatch(new CreateSingleUser({data: this.newUser}));
  }

  updateUser() {
    this.store.dispatch(
      new UpdateSingleUser({
        userName: this.selectedRow.userName,
        data: {
          classes: this.selected.classes,
          securityGroups: this.selected.securityGroups.map(sg =>
            pick(sg, ['GroupId', 'bit_read', 'bit_delete', 'bit_update'])
          )
        }
      })
    );
  }

  deleteUser() {
    this.store.dispatch(
      new DeleteSingleUser({
        userName: this.selectedRow.userName
      })
    );
  }

  resetUserPassword() {
    //  Call api for reset password
    this.store.dispatch(
      new UpdateSingleUserPassword({userName: this.selectedRow.userName, data: this.NewPassword})
    );
  }

  enableUser(row) {
    this.store.dispatch(
      new UpdateSingleUser({userName: row.userName, data: {personaldata: {enabled: true}}})
    );
  }

  disableUser(row) {
    this.store.dispatch(
      new UpdateSingleUser({userName: row.userName, data: {personaldata: {enabled: false}}})
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
