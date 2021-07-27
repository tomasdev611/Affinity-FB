import {Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {PotentialComponent} from './potential/potential.component';
import {DetailsComponent} from './details/details.component';
import {PrintComponent} from './print/print.component';
import {OverviewComponent} from './details/overview/overview.component';
import {RemindersComponent} from './details/reminders/reminders.component';
import {AttachmentsComponent} from './details/attachments/attachments.component';
import {CustomfieldsComponent} from './details/customfields/customfields.component';
import {ContactsComponent} from './details/contacts/contacts.component';
import {VisitsComponent} from './details/visits/visits.component';
import {NotesComponent} from './details/notes/notes.component';
import {DirectionsMiscComponent} from './details/directions-misc/directions-misc.component';
import {ExclusionPreferencesComponent} from './details/exclusions-preferences/exclusion-preferences.component';
import {InterruptionsServiceComponent} from './details/interruptions-service/interruptions-service.component';
import {PlanOfCareComponent} from './details/plan-of-care/plan-of-care.component';
import {ServiceOrdersComponent} from './details/service-orders/service-orders.component';
import {SupervisoryVisitsComponent} from './details/supervisory-visits/supervisory-visits.component';

export const ClientRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'print',
        component: PrintComponent,
        data: {
          heading: 'Print'
        }
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          heading: 'Clients'
        }
      },
      {
        path: 'potential',
        component: PotentialComponent,
        data: {
          heading: 'Potential Clients'
        }
      },
      {
        path: 'details/:id',
        component: DetailsComponent,
        children: [
          {path: '', component: OverviewComponent},
          {
            path: 'reminders',
            component: RemindersComponent
          },
          {
            path: 'attachments',
            component: AttachmentsComponent
          },
          {
            path: 'customfields',
            component: CustomfieldsComponent
          },
          {
            path: 'contacts',
            component: ContactsComponent
          },
          {
            path: 'visits',
            component: VisitsComponent
          },
          {
            path: 'notes',
            component: NotesComponent
          },
          {
            path: 'directions-misc',
            component: DirectionsMiscComponent
          },
          {
            path: 'exclusions-preferences',
            component: ExclusionPreferencesComponent
          },
          {
            path: 'interruptions-service',
            component: InterruptionsServiceComponent
          },
          {
            path: 'plan-of-care',
            component: PlanOfCareComponent
          },
          {
            path: 'service-orders',
            component: ServiceOrdersComponent
          },
          {
            path: 'supervisory-visits',
            component: SupervisoryVisitsComponent
          }
        ],
        data: {
          heading: 'Client Details'
        }
      }
    ]
  }
];
