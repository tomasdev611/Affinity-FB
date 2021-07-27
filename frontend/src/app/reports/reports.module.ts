import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AllComponent} from './all/all.component';
import {BillingComponent} from './billing/billing.component';
import {PayrollComponent} from './payroll/payroll.component';
import {ComplianceReportsClientComponent} from './compliance/compliance.component';
import {ComplianceReportsCaregiverComponent} from './compliance-caregiver/compliance-caregiver.component';
import {CaregiverContactsComponent} from './caregiver_contacts/caregiver_contacts.component';
import {ClientContactsComponent} from './client_contacts/client_contacts.component';
import {RouterModule} from '@angular/router';
import {ReportsRoutes} from './reports.routing';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModalModule} from '../library/custom-modal/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
// import {CalendarModule, DateAdapter} from 'angular-calendar';
// import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

// import {DataService} from '../services/db/data.service';
// import {SharedModule} from '../shared/shared.module';
import {AgGridModule} from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule,
    ModalModule,
    NgSelectModule,
    AgGridModule.withComponents([]),
    NgxLoadingModule.forRoot({}),
    NgxDatatableModule
  ],
  declarations: [
    AllComponent,
    BillingComponent,
    PayrollComponent,
    ComplianceReportsClientComponent,
    ComplianceReportsCaregiverComponent,
    CaregiverContactsComponent,
    ClientContactsComponent
  ]
})
export class ReportsModule {}
