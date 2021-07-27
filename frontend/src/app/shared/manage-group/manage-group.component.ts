import * as moment from 'moment';
import {takeUntil} from 'rxjs/operators';
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  ViewChild,
  TemplateRef,
  EventEmitter,
  AfterViewInit,
  Input,
  Output,
  ElementRef
} from '@angular/core';
import {cloneDeep, sortBy, pick} from 'lodash';
import {select, Store} from '@ngrx/store';
import {NotifierService} from 'angular-notifier';

import {DOCUMENT} from '@angular/platform-browser';
import {Observable, Subject} from 'rxjs';

import {ActivatedRoute, Params, ROUTER_CONFIGURATION} from '@angular/router';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import * as fromRoot from '../../states/reducers';
import {AuthService} from '../../services/gaurd/auth.service';
import {MessageService} from '../../services/db/message.service';
import {
  CreateMessageGroup,
  UpdateMessageGroup,
  DeleteMessageGroup,
  LoadMessageGroups
} from '../../states/actions/message.actions';

@Component({
  selector: 'manage-groups-component',
  templateUrl: './manage-group.component.html',
  styleUrls: ['./manage-group.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageGroupComponent implements AfterViewInit {
  @Input() options: any;
  @Output() closeComponent: EventEmitter<any> = new EventEmitter();

  saving: string = '';
  selectedSourceMembers: any = [];
  sourceMembers: any = [];
  selectedGroupMembers: any = [];
  groupMembers: any = [];

  loading: boolean = false;
  group: any = null;
  actionGroup: any = null;

  allMembers: any = [];
  caregivers: any = [];
  clients: any = [];

  groupData: any = [];

  clients$: Observable<any[]>;
  messageGroupInfo$: Observable<any>;
  $commonInfo: Observable<any>;

  check_access_on_init = true;
  access_group_id = 'Scheduling - Calendar';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private store: Store<any>,
    private messageService: MessageService,
    private notifierService: NotifierService,
    @Inject(DOCUMENT) doc: any
  ) {
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  ngOnInit() {
    if (this.options) {
      const {type, initialOptions} = this.options;
      if (type === 'create') {
        this.group = {name: '', members: [...initialOptions], isCaregiverGroup: true};
        // this.populateMembers();
      }
    }

    this.messageGroupInfo$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getMessageGroupInfo)
    );
    this.$commonInfo = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCommon)
    );

    this.$commonInfo.subscribe(data => {
      if (data.loaded) {
        if (this.caregivers !== data.caregivers || this.clients !== data.clients) {
          this.caregivers = data.caregivers;
          this.clients = data.clients;
          if (this.group) {
            this.populateMembers();
          }
        }
      }
    });

    this.messageGroupInfo$.subscribe(data => {
      if (this.saving === 'saving' && data.saving === 'success') {
        this.group = null;
      }
      if (!data.groupLoaded && !data.loading) {
        this.store.dispatch(new LoadMessageGroups());
      } else {
        this.groupData = data.groups;
        this.loading = data.loading;
        this.saving = data.saving;
      }
    });
  }

  ngAfterViewInit() {}

  populateMembers() {
    if (!this.group) {
      return;
    }
    this.allMembers = this.group.isCaregiverGroup
      ? this.caregivers.map(c => ({id: c.SocialSecurityNum, name: `${c.FirstName} ${c.LastName}`}))
      : this.clients.map(c => ({
          id: c.ClientId,
          name: `${c.FirstName} ${c.LastName}`
        }));
    let groupMembers = [...this.group.members];
    let sourceMembers = [];
    // this.allMembers.forEach(m => {
    //   if (this.group.members.includes(m.id)) {
    //     groupMembers.push(m);
    //   } else {
    //     sourceMembers.push(m);
    //   }
    // });
    this.groupMembers = groupMembers;
    this.sourceMembers = sourceMembers;
  }

  moveToGroupMembers() {
    if (this.selectedSourceMembers.length === 0) {
      this.notifierService.notify('warning', 'No members has been selected');
    }
    // let newGroupMembers = [...this.groupMembers];
    let newGroupMembers = cloneDeep(this.groupMembers);
    let sourceMembers = this.sourceMembers.filter(sm => {
      if (this.selectedSourceMembers.includes(sm.id)) {
        newGroupMembers.push(sm);
        return false;
      }
      return true;
    });
    // this.sourceMembers = this.sourceMembers.filter(sm => {
    //   if (this.selectedSourceMembers.includes(sm.id)) {
    //     newGroupMembers.push(sm);
    //     return false;
    //   }
    //   return true;
    // });
    newGroupMembers = sortBy(newGroupMembers, 'name');
    this.selectedSourceMembers = [];
    this.sourceMembers = sourceMembers;
    this.groupMembers = newGroupMembers;
    // this.groupMembers.push(...newGroupMembers);
    // this.groupMembers = sortBy(this.groupMembers, ['name']);
  }

  moveToSourceMembers() {
    if (this.selectedGroupMembers.length === 0) {
      this.notifierService.notify('warning', 'No members has been selected');
    }
    let newSourceMembers = [...this.sourceMembers];
    let groupMembers = this.groupMembers.filter(sm => {
      if (this.selectedGroupMembers.includes(sm.id)) {
        newSourceMembers.push(sm);
        return false;
      }
      return true;
    });
    newSourceMembers = sortBy(newSourceMembers, ['name']);
    this.selectedGroupMembers = [];
    this.sourceMembers = newSourceMembers;
    this.groupMembers = groupMembers;
  }

  addDataAction() {
    this.group = {name: '', members: [], isCaregiverGroup: true};
    this.populateMembers();
  }

  async updateDataAction(row) {
    if (row.members) {
      this.group = cloneDeep(row);
      this.populateMembers();
    } else {
      this.loading = true;
      await this.messageService.fetchSingleGroup(row.GroupId).subscribe(response => {
        this.loading = false;
        this.group = response.group;
        this.populateMembers();
      });
    }
  }

  deleteDataAction(content, row) {
    this.actionGroup = row;
    content.show();
  }

  saveData() {
    const members = this.groupMembers; // .map(m => m.id);
    const data = {...pick(this.group, ['name', 'isCaregiverGroup']), members};
    if (this.group.GroupId) {
      this.updateData(data);
    } else {
      this.addNewData(data);
    }
  }

  sourceMemberDoubleClick(event, t) {
    this.moveToGroupMembers();
  }

  groupMemberDoubleClick(event, t) {
    this.moveToSourceMembers();
  }

  cancelEdit() {
    this.group = null;
  }

  addNewData(data) {
    this.store.dispatch(new CreateMessageGroup(data));
  }

  updateData(data) {
    this.store.dispatch(
      new UpdateMessageGroup({
        GroupId: this.group.GroupId,
        data
      })
    );
  }

  deleteData(content) {
    this.store.dispatch(
      new DeleteMessageGroup({
        GroupId: this.actionGroup.GroupId
      })
    );
    content.hide();
  }

  messageGroupAction(row) {
    const chatboxOptions = {
      group: pick(row, ['GroupId', 'name', 'groupSize']),
      RoomId: row.GroupId
    };
    this.messageService.addNewInstance(chatboxOptions);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  trackById(index, row) {
    return row.id;
  }

}
