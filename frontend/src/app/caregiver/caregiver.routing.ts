import {Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {DetailsComponent} from './details/details.component';
import {RemindersComponent} from './details/reminders/reminders.component';
import {AttachmentsComponent} from './details/attachments/attachments.component';
import {VisitsComponent} from './details/visits/visits.component';
import {NotesComponent} from './details/notes/notes.component';
import {OverviewComponent} from './details/overview/overview.component';
import {SearchConsoleComponent} from './search/search-console.component';

export const CaregiverRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListComponent,
        data: {
          heading: 'Caregivers'
        }
      },
      {
        path: 'search',
        component: SearchConsoleComponent,
        data: {
          heading: 'Caregivers Search Console'
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
            path: 'visits',
            component: VisitsComponent
          },
          {
            path: 'notes',
            component: NotesComponent
          }
        ],
        data: {
          heading: 'Details'
        }
      }
    ]
  }
];
