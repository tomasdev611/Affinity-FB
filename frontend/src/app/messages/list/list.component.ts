import {Component, OnInit, ViewChild} from '@angular/core';
import {cloneDeep, omitBy, pick} from 'lodash';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {AgmMap} from '@agm/core';
import {LoadChatRooms} from '../../states/actions/message.actions';
import * as fromRoot from '../../states/reducers';

import {AuthService} from '../../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {
  getFieldFromCollectionsWithID,
  getAddressString,
  getErrorMessage
} from '../../utils/helpers';
import {MessageService} from '../../services/db/message.service';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';

const DEFAULT_FILTER = {
  type: 'INDIVIDUAL',
  sourceType: 'OWN',
  securityUserName: ''
};

@Component({
  selector: 'app-chatrooms',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
/**
 *
 */
export class ListComponent implements OnInit, AfterViewInit {
  @ViewChild('agmMap') agmMap: AgmMap;

  mode: string = 'active';

  loading = false;
  isCollapsedFilter = false;
  chatrooms = [];
  chatroom = null;
  allChatrooms = [];
  pageInfo = {
    pageSize: 10,
    currentPage: 1
  };
  filterInfo: any = {};

  //row data To be displayed
  rowData: any;

  commonClients = [];
  securityUsers = [];
  selectSecurityUsers = [];
  phoneNumbers = [];
  // languages = [];
  // classesNames = [];
  // clients = [];
  // selectedClientId: any;

  // clientDetailMap: any;
  // clientDetail: any;
  // currentFilterClient: any;
  // selectedChatrooms = {};
  // selectedChatroomIds = [];
  // selectedSkills = {};
  calendarOptions: any = {lockChatroom: true, readonly: true};

  // table column api
  gridColumnApi: any;
  manageGroupOptions: any;

  filter: any = cloneDeep(DEFAULT_FILTER);

  pageData = {
    pageSize: 10,
    currentPage: 0
  };

  totalCount = 0;

  chatrooms$: Observable<any>;
  pageInfo$: Observable<any>;
  $commonInfo: Observable<any>;
  loadChatroomsCalled: boolean = false;
  initialFilterSortSet: boolean = false;

  showUsernamePhoneFilter = false;

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   *
   * @param chatroomService
   */
  constructor(
    private router: Router,
    // private detailsComponent: DetailsComponent,
    private authService: AuthService,
    private location: Location,
    private notifierService: NotifierService,
    private messageService: MessageService,
    private store: Store<any>
  ) {
    // localStorage.removeItem('chatroom_columns');
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
    this.showUsernamePhoneFilter = authService.checkOverallAccess('Administrator').read;
    // localStorage.removeItem('chatroom_columns');
  }

  getRowDataFrom(data) {
    let result = data;
    if (!result) {
      return [];
    }
    result = result.map(row => ({
      ...row,
      StatusText: row.Status === 'A' ? 'Active' : 'Inactive'
      // AddressText: getAddressString(row)
    }));
    return result;
  }

  ngOnInit() {
    this.chatrooms$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getChatRoomInfo)
    );

    this.$commonInfo = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCommon)
    );

    this.$commonInfo.subscribe(data => {
      if (data.loaded) {
        // if (this.commonClients !== data.clients) {
        //   this.commonClients = data.clients;
        //   this.generateClientsChatrooms();
        // }
        if (this.securityUsers !== data.securityUsers) {
          this.securityUsers = data.securityUsers;

          if (this.securityUsers && this.authService.checkOverallAccess('Administrator').read) {
            this.selectSecurityUsers = [
              ...this.securityUsers.map(m => ({name: m.userName, value: m.userName}))
            ];
          }
        }
        if (this.phoneNumbers !== data.phoneNumbers) {
          this.phoneNumbers = data.phoneNumbers;
        }
      }
    });

    this.chatrooms$.subscribe(data => {
      if (!data.loading && !data.loaded) {
        this.searchChatroom();
      }
      if (this.chatrooms !== data.list) {
        this.chatrooms = data.list;
        this.rowData = this.getRowDataFrom(this.chatrooms);
      }
      if (this.filterInfo !== data.filterInfo) {
        this.filterInfo = data.filterInfo;
      }
      if (this.pageInfo !== data.pageInfo) {
        this.pageInfo = data.pageInfo;
      }
      if (this.loading !== data.loading) {
        this.loading = data.loading;
      }
      if (this.totalCount !== data.totalCount) {
        this.totalCount = data.totalCount;
      }
    });

    let link = this.location.path();
    this.authService.checkAndAddLink({
      link,
      title: 'Chatrooms',
      canClose: true,
      type: 'chatroom'
    });
  }

  getAll() {
    // this.store.dispatch(new LoadChatrooms());
    // this.loadChatroomsCalled = true;
  }

  ngAfterViewInit() {
    $('.page-count > span').text('');
    $('.page-count').text('');
    $('.empty-row').html(
      '<img style="display:block; margin-left:auto; margin-right:auto;" width="150" height="150" src="assets/images/loader.gif">'
    );
  }

  onSelect(selected) {
    if (selected && selected.length === 1) {
      let _navigateLink = '/chatroom/details/' + selected[0].SocialSecurityNum;
      this.router.navigate([_navigateLink]);
    }
  }

  onSecurityUserChange() {
    // if (!this.filter.ClientId) {
    //   this.clientDetail = null;
    // } else {
    //   if (this.clientDetailMap && this.clientDetailMap[this.filter.ClientId]) {
    //     this.clientDetail = this.clientDetailMap[this.filter.ClientId];
    //   } else {
    //     this.clientDetail = null;
    //     this.store.dispatch(new LoadSingleClient(this.filter.ClientId));
    //   }
    // }
  }

  // for closing the modal when move another component
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  load() {
    location.reload();
  }

  searchChatroom() {
    // if (!this.filter.ClientId) {
    //   this.notifierService.notify('info', 'You need to select client');
    //   return;
    // }
    if (this.filter.sourceType === 'PHONE') {
      if (!this.filter.phoneNumber) {
        this.notifierService.notify('warning', 'Phone number needs to be selected');
        return;
      }
    } else if (this.filter.sourceType === 'USERNAME') {
      if (!this.filter.securityUserName) {
        this.notifierService.notify('warning', 'Security user needs to be selected');
        return;
      }
    }
    this.pageData.currentPage = 1;
    const params = omitBy(
      {
        ...this.pageData,
        ...this.filter
      },
      (val, key) => {
        return !val;
      }
    );
    this.store.dispatch(new LoadChatRooms(params));
  }

  getChatroomsForPage() {
    const params = omitBy(
      {
        ...this.pageData,
        ...this.filter
      },
      (val, key) => {
        return !val;
      }
    );
    this.store.dispatch(new LoadChatRooms(params));
  }

  openChatRoom(chatroom) {
    let chatboxOptions;
    if (chatroom.GroupId) {
      chatboxOptions = {
        group: pick(chatroom.Group, ['GroupId', 'name', 'groupSize']),
        RoomId: chatroom.RoomId
      };
    } else {
      chatboxOptions = {caregiver: chatroom.caregiver, RoomId: chatroom.RoomId};
    }
    this.messageService.addNewInstance(chatboxOptions);
  }

  getName(collection, id, idField = 'id', field = 'name') {
    if (!collection) {
      return '';
    }
    let info = collection.find(c => c[idField] === id);
    if (info) {
      return info[field];
    }
    return '';
  }
}
