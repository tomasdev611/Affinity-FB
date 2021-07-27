import {Component, OnInit, ViewChild} from '@angular/core';
import {cloneDeep} from 'lodash';
import * as moment from 'moment';
import Papa from 'papaparse';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
// import {LoadCaregivers} from '../../states/actions/caregiver.actions';
import {
  SetCaregiverComplianceListPageInfo,
  LoadCaregiverCompliances
} from '../../states/actions/compliance.actions';
import * as fromRoot from '../../states/reducers';

// import {DatatableComponent} from '@swimlane/ngx-datatable';
import {AuthService} from '../../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {LOCKED_NUMBER_COLUMN} from '../../common/default';
import {getFieldFromCollectionsWithID} from '../../utils/helpers';

import 'jspdf-autotable';
// import * as autoTable from 'jspdf-autotable';

declare let jsPDF;

import 'rxjs/Rx';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';

import {AgGridAngular} from 'ag-grid-angular';

const DEFAULT_CAREGIVER_COLUMNS = [
  {headerName: 'FirstName', field: 'FirstName'},
  {headerName: 'LastName', field: 'LastName'},
  {headerName: 'Status', field: 'Status'},
  {headerName: 'Phone1', field: 'Phone1'},
  {headerName: 'City', field: 'City'},
  {headerName: 'Zip', field: 'Zip'},
  {headerName: 'HireDate', field: 'StatusDate'},
  {headerName: 'Class', field: 'Class'},
  {headerName: 'NPI', field: 'NPI'},
  {headerName: 'Country', field: 'className'}
];

@Component({
  selector: 'app-reports-compliance-caregiver',
  templateUrl: './compliance-caregiver.component.html',
  styleUrls: ['./compliance-caregiver.component.scss']
})
/**
 *
 */
export class ComplianceReportsCaregiverComponent implements OnInit, AfterViewInit {
  // @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('agGrid') agGrid: AgGridAngular;

  temp_show_hide_array = [];
  mode: string = 'A';
  dueMode: string = 'now';
  reminderMode: string = 'A';

  //column array
  columnDefs = [];
  customFields = [];
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };
  // Store All Caregiver Data
  caregiverData = [];
  //row data To be displayed
  rowData: any;

  classifications = [];
  reminderDescriptions = [];

  caregiverFields = [];

  columnReminders = [];
  tempColumnReminders = [];
  // relations: any;
  // referredBy = []; // // for store Referred By drop down array in personal data
  // counties = [];
  // locationData = [];
  // reasonData = []; //  for caregiver reasonData

  // table column api
  gridColumnApi: any;

  dynamiCusCol2 = [
    {headerName: 'FirstName', field: 'FirstName'},
    {headerName: 'MiddleInitial', field: 'MiddleInit'},
    {headerName: 'LastName', field: 'LastName'},
    {headerName: 'Address1', field: 'Address1'},
    {headerName: 'City', field: 'City'},
    {headerName: 'Zip', field: 'Zip'},
    {headerName: 'Gender', field: 'str_Gender'},
    {headerName: 'Class', field: 'Class'},
    {headerName: 'Status', field: 'Status'},
    {headerName: 'Reason', field: 'str_reason'},
    {headerName: 'Phone1', field: 'Phone1'},
    {headerName: 'SocialSecurityNum', field: 'SocialSecurityNum'},
    {headerName: 'HireDate', field: 'StatusDate'},
    {headerName: 'TermDate', field: 'InactiveDate'},
    {headerName: 'DateofBirth', field: 'DateofBirth'},
    {headerName: 'Email', field: 'Email'},
    {headerName: 'NPI', field: 'NPI'},
    {headerName: 'DoNotRehire', field: 'doNotRehire'},
    {headerName: 'IndependentContractor', field: 'independentContractor'},
    {headerName: 'ValidDriversLicense', field: 'ValidDriversLicense'},
    {headerName: 'Smoker', field: 'Smoker'},
    {headerName: 'WeightRestriction', field: 'WeightRestriction'},
    {headerName: 'BackgroundCheck', field: 'BackgroundCheck'},
    {headerName: 'Country', field: 'className'},
    {headerName: 'TextMessage', field: 'TextMessage'}
  ];

  caregivers$: Observable<any[]>;
  pageInfo$: Observable<any>;
  $commonInfo: Observable<any>;
  loadCaregiversCalled: boolean = false;
  initialFilterSortSet: boolean = false;
  loading: boolean = false;

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
    private store: Store<any>
  ) {
    // localStorage.removeItem('compliance_caregiver_columns');
    if (this.check_access_on_init) {
      this.acl_allow = authService.checkOverallAccess(this.access_group_id);
      if (!this.acl_allow.read) {
        this.router.navigate(['/admin/page404']);
      }
    }
  }

  getRowDataFrom(data) {
    let result = data;
    if (this.mode !== 'all') {
      result = result.filter(row => {
        if (this.mode === 'A') {
          return row.Status === 'A';
        } else if (this.mode === 'I') {
          return row.Status === 'I';
        }
        return false;
      });
    }
    result = result.map(row => ({
      ...row,
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
    // to check custom column array in local storage if fields exists then clear it
    if (!localStorage.getItem('compliance_caregiver_columns_alll')) {
      localStorage.setItem(
        'compliance_caregiver_columns_alll',
        JSON.stringify(
          DEFAULT_CAREGIVER_COLUMNS.map(col => ({
            headerName: col.headerName,
            field: col.field,
            hide: false
          }))
        )
      );
      this.columnDefs = DEFAULT_CAREGIVER_COLUMNS;
    } else {
      this.columnDefs = JSON.parse(localStorage.getItem('compliance_caregiver_columns_alll'));
    }

    this.caregivers$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getComplianceCaregiverReports)
    );
    this.pageInfo$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getComplianceCaregiverListPageInfo)
    );
    this.$commonInfo = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCommon)
    );

    this.store
      .pipe(
        takeUntil(this._unsubscribeAll),
        select(fromRoot.getComplianceLoading)
      )
      .subscribe(loading => {
        this.loading = loading;
      });

    this.$commonInfo.subscribe(data => {
      if (data.loaded) {
        this.customFields = data.customfields.filter(cf => cf.showCaregiver);
        if (this.classifications !== data.classifications) {
          this.classifications = data.classifications;
          this.rowData = this.getRowDataFrom(this.caregiverData);
        }

        if (this.reminderDescriptions !== data.reminderDescriptions) {
          this.reminderDescriptions = data.reminderDescriptions;
        }
        this.createDynamicColumn();
        if (this.caregiverData.length === 0 && !this.loadCaregiversCalled) {
          this.getAll();
        }
      }
    });

    this.caregivers$.subscribe(data => {
      if (data.length === 0 && !this.loadCaregiversCalled) {
        // this.getAll();
      } else {
        this.caregiverData = data;
        this.rowData = this.getRowDataFrom(data);
        // this.generateColumnsList();
      }
    });

    this.pageInfo$.subscribe(data => {
      if (this.mode !== data.statusFilter) {
        this.mode = data.statusFilter;
        this.rowData = this.getRowDataFrom(this.caregiverData);
      }
      if (this.dueMode !== data.dueMode) {
        this.dueMode = data.dueMode || 'now';
      }

      if (this.reminderMode !== data.reminderMode) {
        this.reminderMode = data.reminderMode;
      }

      if (!this.initialFilterSortSet) {
        this.initialFilterSortSet = true;
        setTimeout(() => {
          this.agGrid.api.setFilterModel(data.filter);
          this.agGrid.api.setSortModel(data.sort);
          if (data.pageSize) {
            this.agGrid.api.paginationSetPageSize(data.pageSize);
          }
          if (data.currentPage) {
            this.agGrid.api.paginationGoToPage(data.currentPage);
          }
        }, 200);
      }
    });

    let link = this.location.path();
    this.authService.checkAndAddLink({
      link,
      title: 'Compliance - Caregiver',
      canClose: true,
      type: 'report'
    });
  }

  createDynamicColumn() {
    let tempColumnCaregivers = [];
    let tempColumnReminders = [];
    // let tempColumnsAll = [];
    const existingFields = this.columnDefs.map(f => f.field);
    for (let p = 0; p < this.dynamiCusCol2.length; p++) {
      // if (!fieldMap[this.dynamiCusCol2[p].field]) {
      tempColumnCaregivers.push({
        headerName: this.dynamiCusCol2[p].headerName,
        field: this.dynamiCusCol2[p].field,
        hide: !existingFields.includes(this.dynamiCusCol2[p].field)
      });
      // }
    }
    for (let p = 0; p < this.customFields.length; p++) {
      // if (!fieldMap[this.dynamiCusCol2[p].field]) {
      tempColumnCaregivers.push({
        headerName: this.customFields[p].cfieldName,
        field: this.customFields[p].cfieldName,
        hide: !existingFields.includes(this.customFields[p].cfieldName)
      });
      // }
    }
    this.caregiverFields = tempColumnCaregivers;

    tempColumnReminders = this.reminderDescriptions
      .filter(col => col.caregivers)
      .map(col => ({
        headerName: col.description,
        field: col.description,
        hide: !existingFields.includes(col.description)
      }));
    this.columnReminders = tempColumnReminders;
    this.updateColumnDefs();
  }

  updateColumnDefs() {
    const fields = [
      ...this.columnReminders.filter(f => !f.hide).map(f => f.field),
      ...this.caregiverFields.filter(f => !f.hide).map(f => f.field)
    ];
    let tempColumnDefs = this.columnDefs.filter(f => f.field && fields.includes(f.field));

    let fieldMap = tempColumnDefs.reduce((obj, cur) => {
      obj[cur.field] = true;
      return obj;
    }, {});

    for (let p = 0; p < this.caregiverFields.length; p++) {
      if (!this.caregiverFields[p].hide && !fieldMap[this.caregiverFields[p].field]) {
        tempColumnDefs.push({
          headerName: this.caregiverFields[p].headerName,
          field: this.caregiverFields[p].field,
          hide: false
        });
      }
    }

    for (let p = 0; p < this.columnReminders.length; p++) {
      if (!this.columnReminders[p].hide && !fieldMap[this.columnReminders[p].field]) {
        tempColumnDefs.push({
          headerName: this.columnReminders[p].headerName,
          field: this.columnReminders[p].field,
          hide: false
        });
      }
    }
    localStorage.setItem('compliance_caregiver_columns_alll', JSON.stringify(tempColumnDefs));
    this.columnDefs = [LOCKED_NUMBER_COLUMN, ...tempColumnDefs];
  }

  getAll() {
    const query: any = {};
    if (this.mode !== 'all') {
      query.status = this.mode;
    }
    if (this.dueMode === '30days') {
      query.expirationDate = moment()
        .add(30, 'days')
        .format('YYYY-MM-DD');
    } else {
      query.expirationDate = moment().format('YYYY-MM-DD');
    }
    if (this.reminderMode !== 'all') {
      query.reminderMode = this.reminderMode;
    }
    query.reminderTypes = this.columnReminders.filter(cr => !cr.hide).map(cr => cr.field);
    query.fields = this.caregiverFields.filter(f => !f.hide).map(f => f.field);
    if (query.reminderTypes.length === 0) {
      return;
    }
    this.store.dispatch(new LoadCaregiverCompliances(query));
    this.loadCaregiversCalled = true;
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
      let _navigateLink = '/caregiver/details/' + selected[0].SocialSecurityNum;
      this.router.navigate([_navigateLink]);
    }
  }

  // modal action on click of show/hide
  newColFilterAction(content) {
    this.temp_show_hide_array = cloneDeep(this.caregiverFields.filter(column => column.field));
    content.show();
  }

  // modal action on click of show/hide
  showReminderTypesModal(content) {
    this.tempColumnReminders = cloneDeep(this.columnReminders.filter(column => column.field));
    content.show();
  }

  // update local storage values
  updateTableColShowHide(content) {
    localStorage.setItem('compliance_caregiver_columns', JSON.stringify(this.temp_show_hide_array));
    this.caregiverFields = cloneDeep(this.temp_show_hide_array);
    this.updateColumnDefs();
    // this.columnDefs = [LOCKED_NUMBER_COLUMN, ...cloneDeep(this.temp_show_hide_array)];
    content.hide();
  }

  updateReminderColumns(content) {
    localStorage.setItem(
      'compliance_caregiver_reminder_columns',
      JSON.stringify(this.tempColumnReminders)
    );
    this.columnReminders = cloneDeep(this.tempColumnReminders);
    this.getAll();
    this.updateColumnDefs();
    content.hide();
  }

  // for closing the modal when move another component
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // Final Code for Download CSV Function
  downloadCsvFile() {
    var csvData = this.generateCSVData(this.rowData);

    var blob = new Blob([csvData], {type: 'text/csv'});
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, 'CaregiverComplianceReports.csv');
    } else {
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'CaregiverComplianceReports.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // convert Json to CSV data in Angular2
  generateCSVData(objArray) {
    let fields = this.columnDefs.filter(col => !col.hide).map(col => col.field);
    let data = objArray.map(row => {
      return fields.map(field => row[field]);
    });
    return Papa.unparse({fields, data});
  }

  // FOR CAREGIVER
  //  for convert json to pdf and download pdf file on click of button
  selectedColumnPdfDownload(): void {
    let selectedRowData = this.rowData;
    let columns = this.columnDefs.filter(col => !col.hide).map(col => col.field);
    let rows = selectedRowData.map((row, index) => {
      return columns.map(field => (field ? row[field] || 'N/A' : index + 1));
    });
    let docWidth = columns.length * 200;
    let docHeight = rows.length * 22 + 60;
    //Only pt supported (not mm or in)
    let docMode = columns.length > 7 ? 'l' : 'p';
    var doc = new jsPDF('l', 'pt', [docHeight, docWidth]);
    doc.autoTable(columns.map(c => ({title: c, header: c})), rows, {
      styles: {fillColor: [100, 255, 255]},
      columnStyles: {
        id: {fillColor: 255}
      },
      margin: {top: 60},
      addPageContent: function(data) {
        doc.text('Caregiver Report', 40, 30);
      }
    });
    doc.save('CaregiverComplianceReports.pdf');
  }

  //get Active users
  setUserStatusType(statusFilter) {
    this.store.dispatch(new SetCaregiverComplianceListPageInfo({statusFilter}));
    setTimeout(() => {
      this.getAll();
    }, 100);
  }

  setReminderMode(reminderMode) {
    this.store.dispatch(new SetCaregiverComplianceListPageInfo({reminderMode}));
    setTimeout(() => {
      this.getAll();
    }, 100);
  }

  //get Active users
  setDueMode(dueMode) {
    this.store.dispatch(new SetCaregiverComplianceListPageInfo({dueMode}));
    setTimeout(() => {
      this.getAll();
    }, 100);
  }

  /*
   ** new code for ag-grid table in order to get rid of issue of ngx-datatable
   */

  //runs when a user is selected from table
  onSelectionChanged() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.onSelect(selectedData);
  }

  updateColumnDefsFromTable() {
    let temp_columns_from_api: any = this.gridColumnApi.getAllGridColumns();
    let tempColumnDefs = this.columnDefs;

    tempColumnDefs = temp_columns_from_api
      .map(column => {
        return {...column.colDef, width: column.actualWidth || column.colDef.width};
      })
      .filter(column => column.field);
    localStorage.setItem('compliance_caregiver_columns_all', JSON.stringify(tempColumnDefs));
    this.columnDefs = [LOCKED_NUMBER_COLUMN, ...tempColumnDefs];
  }

  paginationChanged() {
    const currentPage = this.agGrid.api.paginationGetCurrentPage();
    const pageSize = this.agGrid.api.paginationGetPageSize();
    this.store.dispatch(new SetCaregiverComplianceListPageInfo({pageSize, currentPage}));
  }

  filterChanged() {
    let filter: any = this.agGrid.api.getFilterModel();
    this.store.dispatch(new SetCaregiverComplianceListPageInfo({filter}));
    this.agGrid.api.refreshCells();
  }

  sortChanged() {
    let sort: any = this.agGrid.api.getSortModel();
    this.store.dispatch(new SetCaregiverComplianceListPageInfo({sort}));
    this.agGrid.api.refreshCells();
  }

  //get api reference
  onGridReady(params) {
    this.gridColumnApi = params.columnApi;
  }

  //executes when a table column is dragged
  dragStopped(event) {
    this.updateColumnDefsFromTable();
  }
}
