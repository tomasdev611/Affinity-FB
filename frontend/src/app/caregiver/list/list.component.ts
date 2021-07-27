import {Component, OnInit, ViewChild} from '@angular/core';
import {cloneDeep} from 'lodash';
import Papa from 'papaparse';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {LoadCaregivers, SetCaregiverListPageInfo} from '../../states/actions/caregiver.actions';
import * as fromRoot from '../../states/reducers';
import {AuthService} from '../../services/gaurd/auth.service';
import {Location} from '@angular/common';
import {LOCKED_NUMBER_COLUMN} from '../../common/default';
import {DEFAULT_CAREGIVER_COLUMNS, CAREGIVER_COLUMNS} from '../../common/constants';
import {getFieldFromCollectionsWithID, getFieldFromCollectionsWithIDs} from '../../utils/helpers';

import 'jspdf-autotable';
// import * as autoTable from 'jspdf-autotable';

declare let jsPDF;

import 'rxjs/Rx';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';

import {AgGridAngular} from 'ag-grid-angular';

@Component({
  selector: 'app-caregiver-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
/**
 *
 */
export class ListComponent implements OnInit, AfterViewInit {
  // @ViewChild(DatatableComponent) table: DatatableComponent;

  @ViewChild('agGrid') agGrid: AgGridAngular;

  temp_show_hide_array = [];
  mode: string = 'active';
  filterClassificationID: string = '';
  needInitialSetForClassificationFilter = true;
  termClassification: any;

  //column array
  columnDefs = [];
  customFields = [];

  // Store All Caregiver Data
  caregiverData = [];
  //row data To be displayed
  rowData: any;
  defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };
  // table column api
  gridColumnApi: any;
  manageGroupOptions: any;

  // for static column fields in table
  dynamiCusCol2 = [...CAREGIVER_COLUMNS];

  classifications = [];
  revisedClassifications = [];
  availabilities = [];

  caregivers$: Observable<any[]>;
  pageInfo$: Observable<any>;
  $commonInfo: Observable<any>;
  loadCaregiversCalled: boolean = false;
  initialFilterSortSet: boolean = false;
  showTermClassification: boolean = false;

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
    if (this.mode !== 'all') {
      result = result.filter(row => {
        if (this.mode === 'active') {
          return row.Status === 'A';
        } else if (this.mode === 'inactive') {
          return row.Status === 'I';
        }
        return false;
      });
    }
    if (this.filterClassificationID) {
      const classIds = this.filterClassificationID.split(',').map(c => parseInt(c));
      if (classIds.length === 1) {
        result = result.filter(row => row.ClassificationID === classIds[0]);
      } else {
        result = result.filter(row => classIds.includes(row.ClassificationID));
      }
    } else {
      if (this.termClassification) {
        result = result.filter(
          row => row.ClassificationID !== this.termClassification.ClassificationID
        );
      }
    }
    result = result.map(row => ({
      ...row,
      Class: getFieldFromCollectionsWithID(
        this.classifications,
        row.ClassificationID,
        'ClassificationID',
        'Description'
      ),
      Availabilities: getFieldFromCollectionsWithIDs(
        this.availabilities,
        row.AvailabilityIds,
        'id',
        'name',
        '',
        ','
      )
    }));
    return result;
  }

  ngOnInit() {
    // to check custom column array in local storage if fields exists then clear it
    if (!localStorage.getItem('caregiver_columns')) {
      localStorage.setItem(
        'caregiver_columns',
        JSON.stringify([
          LOCKED_NUMBER_COLUMN,
          ...DEFAULT_CAREGIVER_COLUMNS.map(col => ({
            headerName: col.headerName,
            field: col.field,
            colId: col.field,
            hide: false
          }))
        ])
      );
    }
    if (localStorage.getItem('filterClassificationIDList')) {
      this.filterClassificationID = localStorage.getItem('filterClassificationIDList');
      this.needInitialSetForClassificationFilter = false;
    }

    this.caregivers$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCaregivers)
    );
    this.pageInfo$ = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCaregiverListPageInfo)
    );
    this.$commonInfo = this.store.pipe(
      takeUntil(this._unsubscribeAll),
      select(fromRoot.getCommon)
    );

    this.$commonInfo.subscribe(data => {
      if (data.loaded) {
        this.customFields = data.customfields.filter(cf => cf.showCaregiver);
        this.generateColumnsList();
        let shouldRender = false;
        if (this.availabilities !== data.availabilities) {
          this.availabilities = data.availabilities;
          shouldRender = true;
        }
        if (this.classifications !== data.classifications) {
          this.classifications = data.classifications;
          this.setRevisedClassifications();
          shouldRender = true;
        }
        if (shouldRender) {
          this.rowData = this.getRowDataFrom(this.caregiverData);
        }
      }
    });

    this.caregivers$.subscribe(data => {
      if (data.length === 0 && !this.loadCaregiversCalled) {
        this.getAll();
      } else {
        this.caregiverData = data;
        this.rowData = this.getRowDataFrom(data);
        this.generateColumnsList();
      }
    });

    this.pageInfo$.subscribe(data => {
      if (this.mode !== data.statusFilter) {
        this.mode = data.statusFilter;
        this.rowData = this.getRowDataFrom(this.caregiverData);
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
      title: 'Caregiver - List',
      canClose: true,
      type: 'caregiver'
    });
  }

  generateColumnsList() {
    // Fetch all the columns
    let fieldMap = this.dynamiCusCol2.reduce((obj, cur) => {
      obj[cur.field] = true;
      return obj;
    }, {});
    this.customFields.forEach(cf => {
      if (!fieldMap[cf.cfieldName]) {
        fieldMap[cf.cfieldName] = true;
        this.dynamiCusCol2.push({headerName: cf.cfieldName, field: cf.cfieldName});
      }
    });
    this.createDynamicColumn();
  }

  onClassFilterChange() {
    this.rowData = this.getRowDataFrom(this.caregiverData);
    localStorage.setItem('filterClassificationIDList', this.filterClassificationID);
  }

  showTermClassificationChange() {
    let previousClassificationID = this.filterClassificationID;
    this.setRevisedClassifications();
    if (previousClassificationID !== this.filterClassificationID) {
      this.rowData = this.getRowDataFrom(this.caregiverData);
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
        if (this.filterClassificationID === this.termClassification.ClassificationID) {
          if (cnaHHaClass) {
            this.filterClassificationID = cnaHHaClass.ClassificationID;
          } else {
            this.filterClassificationID = '';
          }
        }
      }
    }
    if (this.needInitialSetForClassificationFilter) {
      if (cnaHHaClass && !this.filterClassificationID) {
        this.filterClassificationID = cnaHHaClass.ClassificationID;
      }
      this.needInitialSetForClassificationFilter = false;
    }
    this.revisedClassifications = revisedClassifications;
  }

  createDynamicColumn() {
    let tempColumnDefs = [];
    if (localStorage.getItem('caregiver_columns')) {
      tempColumnDefs = JSON.parse(localStorage.getItem('caregiver_columns'));
    }
    let fieldMap = tempColumnDefs.reduce((obj, cur) => {
      if (cur.field) {
        obj[cur.field] = true;
      }
      return obj;
    }, {});

    for (let p = 0; p < this.dynamiCusCol2.length; p++) {
      if (!fieldMap[this.dynamiCusCol2[p].field]) {
        tempColumnDefs.push({
          headerName: this.dynamiCusCol2[p].headerName,
          field: this.dynamiCusCol2[p].field,
          colId: this.dynamiCusCol2[p].field,
          hide: true
        });
      }
    }
    const lockedColumnExist = tempColumnDefs.find(c => c.colId === LOCKED_NUMBER_COLUMN.colId);
    this.columnDefs = lockedColumnExist
      ? tempColumnDefs
      : [LOCKED_NUMBER_COLUMN, ...tempColumnDefs];
  }

  getAll() {
    this.store.dispatch(new LoadCaregivers());
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

  newColFilterAction(content) {
    this.temp_show_hide_array = cloneDeep(this.columnDefs.filter(column => column.field));
    content.show();
  }

  // update local storage values
  updateTableColShowHide(content) {
    // localStorage.setItem('caregiver_columns', JSON.stringify(this.temp_show_hide_array));
    // this.columnDefs = [LOCKED_NUMBER_COLUMN, ...cloneDeep(this.temp_show_hide_array)];
    const dataMap = this.temp_show_hide_array.reduce((obj, c) => {
      obj[c.field] = c;
      return obj;
    }, {});
    this.columnDefs = this.columnDefs.map(c => {
      if (c.field) {
        return {
          ...c,
          hide: dataMap[c.field].hide
        };
      }
      return c;
    });
    localStorage.setItem('caregiver_columns', JSON.stringify(this.columnDefs));

    let colsToShow = [];
    let colsToHide = [];
    this.columnDefs.forEach(c => {
      if (c.hide) {
        colsToHide.push(c.colId);
      } else {
        colsToShow.push(c.colId);
      }
    });
    this.gridColumnApi.setColumnsVisible(colsToHide, false);
    this.gridColumnApi.setColumnsVisible(colsToShow, true);
    content.hide();
  }

  addNewCaregiver() {
    this.router.navigate(['/caregiver/details/0']);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // Final Code for Download CSV Function
  downloadCsvFile() {
    var csvData = this.generateCSVData(this.rowData);

    var blob = new Blob([csvData], {type: 'text/csv'});
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveBlob(blob, 'CaregiverCSVReport.csv');
    else {
      var a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'CaregiverCSVReport.csv';
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
    doc.save('CaregiverPDFReport.pdf');
  }

  load() {
    location.reload();
  }

  //get Active users
  setUserStatusType(statusFilter) {
    this.store.dispatch(new SetCaregiverListPageInfo({statusFilter}));
  }

  /*
   ** new code for ag-grid table in order to get rid of issue of ngx-datatable
   */

  rowDoubleClicked() {
    const selectedNodes = this.agGrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    this.onSelect(selectedData);
  }

  updateColumnDefsFromTable() {
    let temp_columns_from_api: any = this.gridColumnApi.getAllGridColumns();
    let tempColumnDefs = this.columnDefs;
    tempColumnDefs = temp_columns_from_api.map(column => {
      return {...column.colDef, width: column.actualWidth || column.colDef.width};
    });
    // .filter(column => column.field);
    localStorage.setItem('caregiver_columns', JSON.stringify(tempColumnDefs));
    // this.columnDefs = [LOCKED_NUMBER_COLUMN, ...tempColumnDefs];
    this.columnDefs = tempColumnDefs;
  }

  paginationChanged() {
    const currentPage = this.agGrid.api.paginationGetCurrentPage();
    const pageSize = this.agGrid.api.paginationGetPageSize();
    this.store.dispatch(new SetCaregiverListPageInfo({pageSize, currentPage}));
  }

  filterChanged() {
    let filter: any = this.agGrid.api.getFilterModel();
    this.store.dispatch(new SetCaregiverListPageInfo({filter}));
    this.agGrid.api.refreshCells();
  }

  sortChanged() {
    let sort: any = this.agGrid.api.getSortModel();
    this.store.dispatch(new SetCaregiverListPageInfo({sort}));
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

  showGroupMessagingManagement(content) {
    this.manageGroupOptions = null;
    content.show();
  }

  showGroupMessagingManagementWithCreate(content) {
    const caregivers = [];
    this.agGrid.api.forEachNodeAfterFilter((node, index) => {
      caregivers.push(node.data.SocialSecurityNum);
    });
    this.manageGroupOptions = {type: 'create', initialOptions: caregivers};
    content.show();
  }
}
