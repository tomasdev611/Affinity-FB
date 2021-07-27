import {Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {ScheduleCalendarComponent} from './calendar/calendar.component';

export const ScheduleRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'calendar',
        component: ScheduleCalendarComponent,
        data: {
          heading: 'Calendar'
        }
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          heading: 'Schedules'
        }
      }
    ]
  }
];
