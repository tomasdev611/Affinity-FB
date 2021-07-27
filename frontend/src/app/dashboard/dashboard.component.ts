import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DragulaService} from 'ng2-dragula';

import 'jspdf-autotable';
import * as autoTable from 'jspdf-autotable';
import {AuthService} from '../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {AppComponent} from '../app.component';
import {CaregiverService} from '../services/db/caregiver.service';
import {ClientService} from '../services/db/client.service';

import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import * as fromRoot from '../states/reducers';

//declare var jsPDF: any; // Important
declare let jsPDF;

const shortcutMap = {
  client: {
    link: '/client/list',
    title: 'Clients',
    icon: 'assets/images/icons/client.png',
    canClose: true
  },
  clientType: {
    link: '/admin/master-list/client-type',
    title: 'Client Type',
    icon: 'assets/images/icons/clienttype.png',
    canClose: true
  },
  caseManager: {
    link: '/admin/master-list/case-manager',
    title: 'Case Manager',
    icon: 'assets/images/icons/casemanager.png',
    canClose: true
  },
  payors: {
    link: '/admin/master-list',
    title: 'Payors',
    icon: 'assets/images/icons/payer.png',
    canClose: true
  },
  referralSources: {
    link: '/admin/master-list/refferals',
    title: 'Referral Sources',
    icon: 'assets/images/icons/referral.png',
    canClose: true
  },
  serviceCodes: {
    link: '/admin/master-list/service',
    title: 'Service Codes',
    icon: 'assets/images/icons/servicecode.png',
    canClose: true
  },
  caregivers: {
    link: '/caregiver/list',
    title: 'Caregivers',
    icon: 'assets/images/icons/caregiver.png',
    canClose: true
  },
  Classification: {
    link: '/admin/master-list/classification',
    title: 'Classification',
    icon: 'assets/images/icons/classification.png',
    canClose: true
  },
  scheduling: {
    link: '/schedule/calendar',
    title: 'Scheduling',
    icon: 'assets/images/icons/scheduling.png',
    canClose: true
  },
  callCenter: {
    link: '/admin/master-list',
    title: 'Call Center',
    icon: 'assets/images/icons/callcenter.png',
    canClose: true
  },
  compliance: {
    // link: '/admin/master-list',
    title: 'Compliance',
    // icon: 'assets/images/icons/callcenter.png',
    canClose: true
  }
};

const allShortcuts = Object.keys(shortcutMap).map(b => shortcutMap[b]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  jsonCareReminders = []; // for vcaregiver
  jsonClientReminders = []; // for client
  inactivityTimeout: any;
  allShortcuts = [...allShortcuts];
  shortcuts = [...allShortcuts];
  itemsList = [];
  selectedItem = null;
  dragularModel = [];
  vampires = [];
  searchType = 'Caregiver';
  commonClients = [];
  commonCaregivers = [];
  clients = [];
  caregivers = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  check_access_on_init = false;
  access_group_id = 'Administrator';
  acl_allow = {read: false, update: false, delete: false};
  checkAccess() {
    const acl_list = JSON.parse(localStorage.getItem('acl_list'));
    console.log(acl_list);
    for (var i = 0; i < acl_list.length; i++) {
      var name = acl_list[i].GroupId;
      if (name == this.access_group_id) {
        this.acl_allow.read = acl_list[i].bit_read;
        this.acl_allow.update = acl_list[i].bit_update;
        this.acl_allow.delete = acl_list[i].bit_delete;
      }
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private caregiverService: CaregiverService,
    private clientService: ClientService,
    private location: Location,
    private dragulaService: DragulaService,
    private store: Store<any>,
    private appComponent: AppComponent
  ) {
    if (this.check_access_on_init) {
      this.checkAccess();
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
    this.loadShortcuts();
    this.dragulaService.createGroup('shortcutsDragula', {
      moves: function(el, source, handle, sibling) {
        if (el.className.includes('non-dragabble')) {
          return false;
        }
        return true; // elements are always draggable by default
      },
      accepts: function(el, target, source, sibling) {
        if (!sibling) {
          return false;
        }
        return true; // elements can be dropped in any of the `containers` by default
      }
    });
  }

  ngOnInit() {
    if (this.appComponent.search('Dashboard', this.authService.leftLinks) === -1) {
      this.authService.leftLinks.splice(0, 0, {
        link: '',
        linkName: 'Dashboard',
        canClose: false,
        type: 'dashboard'
      });
    }
    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getCommon)
      )
      .subscribe(data => {
        if (data.loaded) {
          if (this.commonCaregivers !== data.caregivers || this.commonClients !== data.clients) {
            this.commonCaregivers = data.caregivers;
            this.commonClients = data.clients;
            this.generateClientsCaregivers();
          }
        }
      });
  }

  selectSearchType(searchType) {
    this.searchType = searchType;
    this.setListItems();
  }

  goToDetailPage() {
    if (!this.selectedItem) {
      return;
    }
    if (this.searchType === 'Caregiver') {
      this.router.navigate([`/caregiver/details/${this.selectedItem}`]);
    } else if (this.searchType === 'Client') {
      this.router.navigate([`/client/details/${this.selectedItem}`]);
    }
  }

  generateClientsCaregivers() {
    let caregivers = this.commonCaregivers.map(c => ({
      name: `${c.FirstName} ${c.LastName}`,
      id: c.SocialSecurityNum
    }));
    this.caregivers = caregivers;
    let clients = this.commonClients.map(c => ({
      name: `${c.FirstName} ${c.LastName}`,
      id: c.ClientId
    }));
    this.clients = clients;
    this.setListItems();
  }

  setListItems() {
    if (this.searchType === 'Caregiver') {
      this.itemsList = this.caregivers;
    } else if (this.searchType === 'Client') {
      this.itemsList = this.clients;
    } else {
      this.itemsList = [];
    }
  }

  search(nameKey, myArray) {
    //console.log(myArray);
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].linkName === nameKey) {
        return i;
      }
    }
    return -1;
  }

  getCaregiverReminder() {
    // for get caregivers reminders

    // for fetch contacts data
    this.caregiverService.fetchCaregiverReminders().subscribe(data => {
      this.jsonCareReminders = data;
    });
  }

  removeShortcut(row) {
    this.shortcuts = this.shortcuts.filter(s => s.title !== row.title);
    this.saveShortcuts();
  }

  getClientReminder() {
    // for get client reminders
    // for fetch contacts data
    // this.clientService.fetchClientReminders().subscribe((data)=>{
    //   this.jsonClientReminders = data
    // });
  }

  changeOrder(event) {
    this.saveShortcuts();
  }

  showCompliance() {
    return this.shortcuts.findIndex(c => c.title === 'Compliance') > -1;
  }

  showAddShortcutModal(content) {
    content.show();
  }

  addShortcut(shortcut) {
    this.shortcuts.push(shortcut);
    this.saveShortcuts();
  }

  saveShortcuts() {
    localStorage.setItem('shortcuts', JSON.stringify(this.shortcuts));
  }

  loadShortcuts() {
    try {
      if (localStorage.getItem('shortcuts')) {
        this.shortcuts = JSON.parse(localStorage.getItem('shortcuts'));
      }
    } catch (error) {}
  }

  get remainingShortcuts() {
    let existingShortcuts = this.shortcuts.map(s => s.title);
    return this.allShortcuts.filter(s => existingShortcuts.indexOf(s.title) === -1);
  }

  ngOnDestroy() {
    this.dragulaService.destroy('shortcutsDragula');
  }

  // FOR CAREGIVER
  //  for convert json to pdf and download pdf file on click of button
  private careRemDownload(): void {
    //alert(this.getWeekNumber(this.dateformat));
    var columns = ['Caregiver', 'Date', 'Item', 'Notes'];
    var rows = [];

    for (var i = 0; i < this.jsonCareReminders.length; i++) {
      let obj = [];
      //this.jsonCareReminders[i].expirationDate = new Date(this.jsonCareReminders[i].expirationDate).toISOString().slice(0, 19).replace('T', ' ')
      this.jsonCareReminders[i].expirationDate = this.jsonCareReminders[i].expirationDate.substring(
        0,
        10
      );
      obj.push(this.jsonCareReminders[i].name);
      obj.push(this.jsonCareReminders[i].expirationDate);
      obj.push(this.jsonCareReminders[i].description);
      obj.push(this.jsonCareReminders[i].Notes);
      rows.push(obj);
    }
    // Only pt supported (not mm or in)
    var doc = new jsPDF('p', 'pt');
    //doc.autoTable(columns, rows);

    doc.autoTable(columns, rows, {
      styles: {fillColor: [100, 255, 255]},
      columnStyles: {
        id: {fillColor: 255}
      },
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text('Caregiver Reminders ', 40, 30);
      }
    });
    doc.save('reminder.pdf');
  }
  // FOR CLIENT
  //  for convert json to pdf and download pdf file on click of button
  private clientRemDownload(): void {
    //alert(this.getWeekNumber(this.dateformat));
    var columns = ['Client', 'Date', 'Item', 'Notes'];
    var rows = [];
    for (var i = 0; i < this.jsonClientReminders.length; i++) {
      let obj = [];
      //this.jsonCareReminders[i].expirationDate = new Date(this.jsonCareReminders[i].expirationDate).toISOString().slice(0, 19).replace('T', ' ')
      this.jsonClientReminders[i].expirationDate = this.jsonClientReminders[
        i
      ].expirationDate.substring(0, 10);
      obj.push(this.jsonClientReminders[i].name);
      obj.push(this.jsonClientReminders[i].expirationDate);
      obj.push(this.jsonClientReminders[i].description);
      obj.push(this.jsonClientReminders[i].Notes);
      rows.push(obj);
    }
    // Only pt supported (not mm or in)
    var doc = new jsPDF('p', 'pt');
    //doc.autoTable(columns, rows);

    doc.autoTable(columns, rows, {
      styles: {fillColor: [100, 255, 255]},
      columnStyles: {
        id: {fillColor: 255}
      },
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text('Client Reminders ', 40, 30);
      }
    });
    doc.save('reminder.pdf');
  }
}
