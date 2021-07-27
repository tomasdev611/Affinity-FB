import {Component, OnInit, ViewChild} from '@angular/core';
import {cloneDeep} from 'lodash';
import * as moment from 'moment';
import Papa from 'papaparse';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
// import {LoadClients} from '../../states/actions/client.actions';
import {
  SetClientComplianceListPageInfo,
  LoadClientCompliances
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

const DEFAULT_CLIENT_COLUMNS = [
  {headerName: 'LastName', field: 'LastName'},
  {headerName: 'FirstName', field: 'FirstName'},
  {headerName: 'Status', field: 'Status'},
  {headerName: 'Phone', field: 'Phone'},
  {headerName: 'City', field: 'City'},
  {headerName: 'Zip', field: 'Zip'},
  {headerName: 'ClientTypeName', field: 'ClientTypeName'}
];

@Component({
  selector: 'app-reports-compliance-client',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})
/**
 *
 */
export class ComplianceReportsClientComponent implements OnInit, AfterViewInit {
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
  // Store All Client Data
  clientData = [];
  //row data To be displayed
  rowData: any;

  clientTypes = [];
  caseManagers = [];
  reminderDescriptions = [];

  clientFields = [];

  columnReminders = [];
  tempColumnReminders = [];
  // relations: any;
  // referredBy = []; // // for store Referred By drop down array in personal data
  // counties = [];
  // locationData = [];
  // reasonData = []; //  for client reasonData

  // table column api
  gridColumnApi: any;

  dynamiCusCol2 = [
    {headerName: 'ClientId', field: 'ClientId'},
    {headerName: 'FirstName', field: 'FirstName'},
    {headerName: 'MiddleInitial', field: 'MiddleInit'},
    {headerName: 'LastName', field: 'LastName'},
    {headerName: 'DateOfBirth', field: 'DateOfBirth'},
    {headerName: 'Address1', field: 'Address1'},
    {headerName: 'City', field: 'City'},
    {headerName: 'County', field: 'County'},
    {headerName: 'Zip', field: 'Zip'},
    {headerName: 'Status', field: 'Status'},
    {headerName: 'Gender', field: 'str_Gender'},
    {headerName: 'Phone', field: 'Phone'},
    {headerName: 'Weight', field: 'Weight'},
    {headerName: 'ServiceStartDate', field: 'ServiceStartDate'},
    {headerName: 'ServiceEndDate', field: 'ServiceEndDate'},
    {headerName: 'Reason', field: 'str_reason'},
    {headerName: 'Email', field: 'Email'},
    {headerName: 'ClientTypeName', field: 'ClientTypeName'},
    {headerName: 'Ambulatory', field: 'Ambulatory'},
    {headerName: 'ReferredByName', field: 'ReferredByName'},
    {headerName: 'RefNumber', field: 'RefNumber'},
    {headerName: 'DNR', field: 'DNR'},
    {headerName: 'Physician', field: 'Physician'},
    {headerName: 'PrimaryDiagnosis', field: 'PrimaryDiagnosis'},
    {headerName: 'Priority', field: 'Priority'},
    {headerName: 'QuickbooksId', field: 'QuickbooksId'},
    {headerName: 'InitialContactID', field: 'InitialContactID'},
    {headerName: 'MedicalRecord#', field: 'MedicalRecord#'},
    {headerName: 'LocationID', field: 'locationID'},
    {headerName: 'Notes', field: 'Notes'},
    {headerName: 'AccountingID', field: 'AccountingID'},
    {headerName: 'CaseManagerName', field: 'CaseManagerName'},
    {headerName: 'TelephonyID', field: 'telephonyID'}
  ];

  clients$: Observable<any[]>;
  pageInfo$: Observable<any>;
  $commonInfo: Observable<any>;
  loadClientsCalled: boolean = false;
  initialFilterSortSet: boolean = false;
  loading: boolean = false;

  check_access_on_init = true;
  access_group_id = 'Client Data';
  acl_allow = {read: false, update: false, delete: false};
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   *
   * @param clientService
   */
  constructor(
    private router: Router,
    // private detailsComponent: DetailsComponent,
    private authService: AuthService,
    private location: Location,
    private store: Store<any>
  ) {
    // localStorage.removeItem('compliance_client_columns');
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
      ClientTypeName: getFieldFromCollectionsWithID(
        this.clientTypes,
        row.clientTypeID,
        'clientTypeID',
        'Name'
      ),
      CaseManagerName: getFieldFromCollectionsWithID(
        this.caseManagers,
        row.CaseManagerId,
        'CaseManagerId',
        ['FirstName', 'LastName']
      )
    }));
    return result;
  }

  ngOnInit() {
    // to check custom column array in local storage if fields exists then clear it
    if (!localStorage.getItem('compliance_client_columns_alll')) {
      localStorage.setItem(
        'compliance_client_columns_alll',
        JSON.stringify(
          DEFAULT_CLIENT_COLUMNS.map(col => ({
            headerName: col.headerName,
            field: col.field,
            hide: false
          }))
        )
      );
      this.columnDefs = DEFAULT_CLIENT_COLUMNS;
    } else {
      this.columnDefs = JSON.parse(localStorage.getItem('compliance_client_columns_alll'));
    }

    this.clients$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getComplianceClientReports)
    );
    this.pageInfo$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getComplianceClientListPageInfo)
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
        this.customFields = data.customfields.filter(cf => cf.showClient);
        if (this.clientTypes !== data.clientTypes || this.caseManagers !== data.caseManagers) {
          this.clientTypes = data.clientTypes;
          this.caseManagers = data.caseManagers;
          this.rowData = this.getRowDataFrom(this.clientData);
        }

        if (this.reminderDescriptions !== data.reminderDescriptions) {
          this.reminderDescriptions = data.reminderDescriptions;
        }
        this.createDynamicColumn();
        if (this.clientData.length === 0 && !this.loadClientsCalled) {
          this.getAll();
        }
      }
    });

    this.clients$.subscribe(data => {
      if (data.length === 0 && !this.loadClientsCalled) {
        // this.getAll();
      } else {
        this.clientData = data;
        this.rowData = this.getRowDataFrom(data);
        // this.generateColumnsList();
      }
    });

    this.pageInfo$.subscribe(data => {
      if (this.mode !== data.statusFilter) {
        this.mode = data.statusFilter;
        this.rowData = this.getRowDataFrom(this.clientData);
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
      title: 'Compliance - Client',
      canClose: true,
      type: 'report'
    });
  }

  createDynamicColumn() {
    let tempColumnClients = [];
    let tempColumnReminders = [];
    // let tempColumnsAll = [];
    const existingFields = this.columnDefs.map(f => f.field);
    for (let p = 0; p < this.dynamiCusCol2.length; p++) {
      // if (!fieldMap[this.dynamiCusCol2[p].field]) {
      tempColumnClients.push({
        headerName: this.dynamiCusCol2[p].headerName,
        field: this.dynamiCusCol2[p].field,
        hide: !existingFields.includes(this.dynamiCusCol2[p].field)
      });
      // }
    }
    for (let p = 0; p < this.customFields.length; p++) {
      // if (!fieldMap[this.dynamiCusCol2[p].field]) {
      tempColumnClients.push({
        headerName: this.customFields[p].cfieldName,
        field: this.customFields[p].cfieldName,
        hide: !existingFields.includes(this.customFields[p].cfieldName)
      });
      // }
    }
    this.clientFields = tempColumnClients;

    tempColumnReminders = this.reminderDescriptions
      .filter(col => col.client)
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
      ...this.clientFields.filter(f => !f.hide).map(f => f.field)
    ];
    let tempColumnDefs = this.columnDefs.filter(f => f.field && fields.includes(f.field));

    let fieldMap = tempColumnDefs.reduce((obj, cur) => {
      obj[cur.field] = true;
      return obj;
    }, {});

    for (let p = 0; p < this.clientFields.length; p++) {
      if (!this.clientFields[p].hide && !fieldMap[this.clientFields[p].field]) {
        tempColumnDefs.push({
          headerName: this.clientFields[p].headerName,
          field: this.clientFields[p].field,
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
    localStorage.setItem('compliance_client_columns_alll', JSON.stringify(tempColumnDefs));
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
    query.fields = this.clientFields.filter(f => !f.hide).map(f => f.field);
    if (query.reminderTypes.length === 0) {
      return;
    }
    this.store.dispatch(new LoadClientCompliances(query));
    this.loadClientsCalled = true;
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
      let _navigateLink = '/client/details/' + selected[0].ClientId;
      this.router.navigate([_navigateLink]);
    }
  }

  // modal action on click of show/hide
  newColFilterAction(content) {
    this.temp_show_hide_array = cloneDeep(this.clientFields.filter(column => column.field));
    content.show();
  }

  // modal action on click of show/hide
  showReminderTypesModal(content) {
    this.tempColumnReminders = cloneDeep(this.columnReminders.filter(column => column.field));
    content.show();
  }

  // update local storage values
  updateTableColShowHide(content) {
    localStorage.setItem('compliance_client_columns', JSON.stringify(this.temp_show_hide_array));
    this.clientFields = cloneDeep(this.temp_show_hide_array);
    this.updateColumnDefs();
    // this.columnDefs = [LOCKED_NUMBER_COLUMN, ...cloneDeep(this.temp_show_hide_array)];
    content.hide();
  }

  updateReminderColumns(content) {
    localStorage.setItem(
      'compliance_client_reminder_columns',
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
      window.navigator.msSaveBlob(blob, 'ClientComplianceReports.csv');
    } else {
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'ClientComplianceReports.csv';
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

  // FOR CLIENT
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
        doc.text('Client Report', 40, 30);
      }
    });
    doc.save('ClientComplianceReports.pdf');
  }

  //get Active users
  setUserStatusType(statusFilter) {
    this.store.dispatch(new SetClientComplianceListPageInfo({statusFilter}));
    setTimeout(() => {
      this.getAll();
    }, 100);
  }

  setReminderMode(reminderMode) {
    this.store.dispatch(new SetClientComplianceListPageInfo({reminderMode}));
    setTimeout(() => {
      this.getAll();
    }, 100);
  }

  //get Active users
  setDueMode(dueMode) {
    this.store.dispatch(new SetClientComplianceListPageInfo({dueMode}));
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
    localStorage.setItem('compliance_client_columns_all', JSON.stringify(tempColumnDefs));
    this.columnDefs = [LOCKED_NUMBER_COLUMN, ...tempColumnDefs];
  }

  paginationChanged() {
    const currentPage = this.agGrid.api.paginationGetCurrentPage();
    const pageSize = this.agGrid.api.paginationGetPageSize();
    this.store.dispatch(new SetClientComplianceListPageInfo({pageSize, currentPage}));
  }

  filterChanged() {
    let filter: any = this.agGrid.api.getFilterModel();
    this.store.dispatch(new SetClientComplianceListPageInfo({filter}));
    this.agGrid.api.refreshCells();
  }

  sortChanged() {
    let sort: any = this.agGrid.api.getSortModel();
    this.store.dispatch(new SetClientComplianceListPageInfo({sort}));
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
