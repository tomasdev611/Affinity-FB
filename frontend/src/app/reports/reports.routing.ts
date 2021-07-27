import {Routes} from '@angular/router';
import {AllComponent} from './all/all.component';
import {BillingComponent} from './billing/billing.component';
import {PayrollComponent} from './payroll/payroll.component';
import {ComplianceReportsClientComponent} from './compliance/compliance.component';
import {ComplianceReportsCaregiverComponent} from './compliance-caregiver/compliance-caregiver.component';
import {CaregiverContactsComponent} from './caregiver_contacts/caregiver_contacts.component';
import {ClientContactsComponent} from './client_contacts/client_contacts.component';

export const ReportsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'all',
        component: AllComponent,
        data: {
          heading: 'All'
        }
      },
      {
        path: 'compliance/client',
        component: ComplianceReportsClientComponent,
        data: {
          heading: 'All'
        }
      },
      {
        path: 'compliance/caregiver',
        component: ComplianceReportsCaregiverComponent,
        data: {
          heading: 'All'
        }
      },
      {
        path: 'visits/caregiver',
        component: CaregiverContactsComponent,
        data: {
          heading: 'All'
        }
      },
      {
        path: 'visits/client',
        component: ClientContactsComponent,
        data: {
          heading: 'All'
        }
      },
      {
        path: 'billing',
        component: BillingComponent,
        data: {
          heading: 'Billing'
        }
      },
      {
        path: 'payroll',
        component: PayrollComponent,
        data: {
          heading: 'Payroll'
        }
      }
    ]
  }
];
