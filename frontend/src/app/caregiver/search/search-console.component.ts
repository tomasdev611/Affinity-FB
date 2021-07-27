import {Component, OnInit, ViewChild} from '@angular/core';
import {cloneDeep, omitBy} from 'lodash';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {AgmMap} from '@agm/core';
import {
  LoadCaregivers,
  SetCaregiverListPageInfo,
  SetCaregiverSearchPageInfo,
  SearchCaregivers,
  GetSearchCaregiversPage,
  SearchCaregiversReset,
  GetSearchCaregiversPageForRemove
} from '../../states/actions/caregiver.actions';
import * as fromRoot from '../../states/reducers';

import {AuthService} from '../../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {
  getFieldFromCollectionsWithID,
  getAddressString,
  getErrorMessage,
  s3UrlFor
} from '../../utils/helpers';
import {MessageService} from '../../services/db/message.service';
import 'jspdf-autotable';

declare let jsPDF;

import 'rxjs/Rx';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {LoadSingleClient} from '../../states/actions/client.actions';

const DEFAULT_FILTER = {
  status: 'A',
  sort: 'distance',
  proximity: '10',
  days: {},
  coOption: 'only',
  minFeedback: 'A',
  minRating: '5',
  languageOption: 'only',
  skills: []
};

@Component({
  selector: 'app-caregiver-search-console',
  templateUrl: './search-console.component.html',
  styleUrls: ['./search-console.component.scss']
})
/**
 *
 */
export class SearchConsoleComponent implements OnInit, AfterViewInit {
  @ViewChild('agmMap') agmMap: AgmMap;

  temp_show_hide_array = [];
  mode: string = 'active';

  // Store All Caregiver Data
  isCollapsed = false;
  isCollapsedFilter = false;
  loading = false;
  caregivers = [];
  caregiver = null;
  allCaregivers = [];
  pageInfo = {
    pageSize: 10,
    currentPage: 1
  };
  filterInfo: any = {};

  //row data To be displayed
  rowData: any;

  commonClients = [];
  skills = [];
  languages = [];
  classesNames = [];
  clients = [];
  selectedClientId: any;

  clientDetailMap: any;
  clientDetail: any;
  currentFilterClient: any;

  selectedCaregivers = {};
  selectedCaregiverIds = [];
  selectedSkills = {};
  calendarOptions: any = {lockCaregiver: true, readonly: true};

  statusMap = {
    A: 'Active',
    I: 'Inactive'
  };

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // table column api
  gridColumnApi: any;
  manageGroupOptions: any;
  needInitialSetForClassificationFilter = true;
  showTermClassification: boolean = false;
  revisedClassifications = [];
  termClassification: any;
  classifications = [];
  availabilities = [];

  filter: any = cloneDeep(DEFAULT_FILTER);

  mapPosition = {
    lat: 43.23,
    lng: -75.23
  };

  pageData = {
    pageSize: 10,
    currentPage: 0
  };
  proximityOptions = Array.apply(null, Array(100)).map(function(a, index) {
    return index + 1;
  });

  caregiversSearchConsole$: Observable<any>;
  pageInfo$: Observable<any>;
  $commonInfo: Observable<any>;
  loadCaregiversCalled: boolean = false;
  initialFilterSortSet: boolean = false;

  sending = false;

  messageInput = '';
  imageData: any;
  filesToUpload: any;

  check_access_on_init = true;
  access_group_id = 'Caregiver Data';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   *
   * @param caregiverService
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
    // localStorage.removeItem('caregiver_columns');
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
    // localStorage.removeItem('caregiver_columns');
  }

  getRowDataFrom(data) {
    let result = data;
    if (!result) {
      return [];
    }
    // if (this.mode !== 'all') {
    //   result = result.filter(row => {
    //     if (this.mode === 'active') {
    //       return row.Status === 'A';
    //     } else if (this.mode === 'inactive') {
    //       return row.Status === 'I';
    //     }
    //     return false;
    //   });
    // }
    result = result.map(row => ({
      ...row,
      StatusText: row.Status === 'A' ? 'Active' : 'Inactive',
      AddressText: getAddressString(row),
      distance: row.distance ? row.distance.toFixed(2) : '',
      LanguageText: row.languages.map(l => this.getName(this.languages, l.LanguageId)).join(', '),
      Class: getFieldFromCollectionsWithID(
        this.classifications,
        row.ClassificationID,
        'ClassificationID',
        'Description'
      )
    }));
    return result;
  }

  ngOnInit() {
    this.caregiversSearchConsole$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCaregiversSearchConsole)
    );

    this.$commonInfo = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCommon)
    );

    this.$commonInfo.subscribe(data => {
      if (data.loaded) {
        if (this.classifications !== data.classifications) {
          this.classifications = data.classifications;
          this.setRevisedClassifications();
          this.rowData = this.getRowDataFrom(this.caregivers);
        }
        if (this.availabilities !== data.availabilities) {
          this.availabilities = data.availabilities;
        }
        if (this.commonClients !== data.clients) {
          this.commonClients = data.clients;
          this.generateClientsCaregivers();
        }
        if (this.skills !== data.skills) {
          this.skills = data.skills;
        }
        if (this.languages !== data.languages) {
          this.languages = data.languages;
        }
        if (this.classesNames !== data.classesNames) {
          this.classesNames = data.classesNames;
        }
      }
    });

    this.caregiversSearchConsole$.subscribe(data => {
      // if (data.length === 0 && !this.loadCaregiversCalled) {
      //   this.getAll();
      // } else {
      //   this.caregiverData = data;
      //   this.rowData = this.getRowDataFrom(data);
      // }
      if (this.caregivers !== data.caregivers) {
        this.caregivers = data.caregivers;
        this.rowData = this.getRowDataFrom(this.caregivers);

        // setTimeout(() => {
        //   this.agmMap.triggerResize(true);
        // }, 200);
      }
      if (this.allCaregivers !== data.allCaregivers) {
        this.allCaregivers = data.allCaregivers;
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
    });

    let link = this.location.path();
    this.authService.checkAndAddLink({
      link,
      title: 'Caregiver - Search Console',
      canClose: true,
      type: 'caregiver'
    });

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getClientDetailMap)
      )
      .subscribe(data => {
        this.clientDetailMap = data;

        if (
          this.clientDetailMap &&
          !this.clientDetail &&
          this.filter.ClientId &&
          data[this.filter.ClientId]
        ) {
          this.clientDetail = data[this.filter.ClientId];
        }
      });
  }

  getAll() {
    // this.store.dispatch(new LoadCaregivers());
    // this.loadCaregiversCalled = true;
  }

  ngAfterViewInit() {
    $('.page-count > span').text('');
    $('.page-count').text('');
    $('.empty-row').html(
      '<img style="display:block; margin-left:auto; margin-right:auto;" width="150" height="150" src="assets/images/loader.gif">'
    );
  }

  showTermClassificationChange() {
    let previousClassificationID = this.filter.classificationID;
    this.setRevisedClassifications();
    if (previousClassificationID !== this.filter.classificationID) {
      // this.rowData = this.getRowDataFrom(this.caregiverData);
    }
  }

  setRevisedClassifications() {
    let revisedClassifications = this.classifications.map(c => ({
      ...c,
      ClassificationID: `${c.ClassificationID}`
    }));
    const cnaHha = revisedClassifications.filter(
      c => c.Description === 'CNA' || c.Description === 'HHA'
    );
    this.termClassification = revisedClassifications.find(c => c.Description === 'TERM');
    revisedClassifications = revisedClassifications.filter(c => c.Description !== 'TERM');
    let cnaHHaClass;
    if (cnaHha.length === 2) {
      cnaHHaClass = {
        Description: 'CNA-HHA',
        ClassificationID: cnaHha.map(c => c.ClassificationID).join(',')
      };
      revisedClassifications.splice(0, 0, cnaHHaClass);
    }
    if (this.termClassification) {
      if (this.showTermClassification) {
        revisedClassifications.push(this.termClassification);
      } else {
        if (this.filter.classificationID === this.termClassification.ClassificationID) {
          if (cnaHHaClass) {
            this.filter.classificationID = cnaHHaClass.ClassificationID;
          } else {
            this.filter.classificationID = '';
          }
        }
      }
    }
    if (this.needInitialSetForClassificationFilter) {
      this.needInitialSetForClassificationFilter = false;
      if (cnaHHaClass && !this.filter.classificationID) {
        this.filter.classificationID = cnaHHaClass.ClassificationID;
      }
    }
    this.revisedClassifications = revisedClassifications;
  }

  generateClientsCaregivers() {
    let clients = this.commonClients.map(c => ({
      name: `${c.FirstName} ${c.LastName}`,
      id: c.ClientId
    }));
    this.clients = clients;
  }

  onSelect(selected) {
    if (selected && selected.length === 1) {
      let _navigateLink = '/caregiver/details/' + selected[0].SocialSecurityNum;
      this.router.navigate([_navigateLink]);
    }
  }

  onClientChange() {
    if (!this.filter.ClientId) {
      this.clientDetail = null;
    } else {
      if (this.clientDetailMap && this.clientDetailMap[this.filter.ClientId]) {
        this.clientDetail = this.clientDetailMap[this.filter.ClientId];
      } else {
        this.clientDetail = null;
        this.store.dispatch(new LoadSingleClient(this.filter.ClientId));
      }
    }
  }

  removeCaregiver(caregiver) {
    const allCaregivers = this.allCaregivers.filter(
      c => c.SocialSecurityNum !== caregiver.SocialSecurityNum
    );
    const caregivers = this.caregivers.filter(
      c => c.SocialSecurityNum !== caregiver.SocialSecurityNum
    );

    let ids = allCaregivers
      .slice(
        (this.pageData.currentPage - 1) * this.pageData.pageSize,
        this.pageData.currentPage * this.pageData.pageSize
      )
      .map(c => c.SocialSecurityNum);
    if (ids.length === this.pageData.pageSize) {
      ids = ids.slice(ids.length - 1);
    } else {
      ids = [];
    }

    this.store.dispatch(
      new GetSearchCaregiversPageForRemove({
        ids,
        allCaregivers: allCaregivers,
        caregivers: caregivers,
        ClientId: this.filterInfo.ClientId
      })
    );
  }

  sendTextMessageToSelected(content) {
    this.messageInput = '';
    this.filesToUpload = null;
    this.imageData = null;
    this.selectedCaregiverIds = Object.keys(this.selectedCaregivers).filter(
      c => this.selectedCaregivers[c]
    );
    if (this.selectedCaregiverIds.length === 0) {
      this.notifierService.notify('warning', 'You need to select at least one caregiver');
      return;
    }
    if (this.selectedCaregiverIds.length > 10) {
      this.notifierService.notify(
        'warning',
        `You can not send message to more than 10 people at a time`
      );
      return;
    }
    content.show();
  }

  resetControlPanel() {
    this.filter = {...cloneDeep(DEFAULT_FILTER), ClientId: this.filter.ClientId};
  }

  resetList() {
    this.store.dispatch(new SearchCaregiversReset());
    this.selectedCaregivers = {};
  }

  openSelectSkills(content) {
    this.selectedSkills = this.filter.skills.reduce((obj, cur) => {
      obj[cur] = true;
      return obj;
    }, {});
    content.show();
  }

  clearSelectedSkills() {
    this.selectedSkills = {};
  }

  saveSelectedSkills(content) {
    const skills = Object.keys(this.selectedSkills).filter(skillId => this.selectedSkills[skillId]);
    this.filter.skills = skills;
    content.hide();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  load() {
    location.reload();
  }

  searchCaregiver() {
    if (!this.filter.ClientId) {
      this.notifierService.notify('info', 'You need to select client');
      return;
    }
    if (!this.clientDetail) {
      this.notifierService.notify('info', 'Client detail not loaded');
      return;
    }
    this.pageData.currentPage = 1;
    if (this.clientDetail) {
      this.currentFilterClient = this.clientDetail;
      this.mapPosition = {
        lat: this.currentFilterClient.lat,
        lng: this.currentFilterClient.lng
      };
    }
    const params = omitBy(
      {
        ...this.pageData,
        ...this.filter
      },
      (val, key) => {
        return !val;
      }
    );
    this.store.dispatch(new SearchCaregivers(params));
    this.selectedCaregivers = {};
  }

  getCaregiversForPage() {
    if (this.allCaregivers.length > 0) {
      const ids = this.allCaregivers
        .slice(
          (this.pageData.currentPage - 1) * this.pageData.pageSize,
          this.pageData.currentPage * this.pageData.pageSize
        )
        .map(c => c.SocialSecurityNum);
      this.store.dispatch(
        new GetSearchCaregiversPage({
          ids,
          ClientId: this.filterInfo.ClientId,
          pageInfo: this.pageData
        })
      );
    }
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

  /*
   ** new code for ag-grid table in order to get rid of issue of ngx-datatable
   */
  addRemoveDay(day) {
    if (this.filter.days['day' + day]) {
      delete this.filter.days['day' + day];
    } else {
      this.filter.days['day' + day] = {start: '', end: ''};
    }
  }

  getPhoto(caregiver) {
    if (caregiver.photo) {
      return s3UrlFor(caregiver.photo);
    }
    return '/assets/images/unsplash/edit_profile.svg';
  }

  openSchedulesFor(content, caregiver) {
    this.calendarOptions.SocialSecurityNum = caregiver.SocialSecurityNum;
    this.calendarOptions.CaregiverName = `${caregiver.FirstName} ${caregiver.LastName}`;
    content.show();
  }

  openNotesFor(content, caregiver) {
    this.caregiver = caregiver;
    content.show();
  }

  openRemindersFor(content, caregiver) {
    this.caregiver = caregiver;
    content.show();
  }

  async sendMessage(content) {
    let file;
    if (this.filesToUpload) {
      file = this.filesToUpload;
    }
    if (!this.messageInput && !file) {
      this.notifierService.notify('warning', 'Please input message or file');
      return;
    }
    const self = this;
    var formData: any = new FormData();
    const target = Object.keys(this.selectedCaregivers).filter(c => this.selectedCaregivers[c]);
    if (target.length === 0) {
      this.notifierService.notify('warning', 'You need to select at least one caregiver');
      return;
    }
    formData.append('target', target);
    formData.append('targetType', 'multi-users');
    formData.append('message', this.messageInput || '');

    if (file) {
      var extension = file.name.substr(file.name.length - 4);
      let img_text = new Date().getTime() + localStorage.getItem('id') + extension;
      formData.append('file', file, img_text);
    }
    this.sending = true;
    this.messageService.sendNewMessage(formData).subscribe(
      data => {
        self.sending = false;
        self.messageInput = '';
        self.filesToUpload = null;
        self.imageData = null;
        this.notifierService.notify('success', 'Message has been sent');
        content.hide();
      },
      error => {
        self.sending = false;
        this.notifierService.notify('warning', `${getErrorMessage(error)}`);
      }
    );
  }

  removePhoto(event) {
    this.filesToUpload = null;
    this.imageData = null;
  }

  sendImage(event) {
    if (event.target.files) {
      const file = event.target.files[0];
      this.filesToUpload = file;
      if (file.type === 'application/pdf') {
        this.imageData = '/assets/images/pdf-file.png';
      } else {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageData = event.target.result;
          // this.uploadProfile();
        };
        reader.readAsDataURL(file);
      }
      event.target.value = '';
    }
  }
}
