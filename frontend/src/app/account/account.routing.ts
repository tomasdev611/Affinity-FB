import {Routes} from '@angular/router';
import {SettingsComponent} from './settings/settings.component';
import {CalendarOptionsComponent} from './settings/calendar-options/calendar-options.component';
import {UsersComponent} from './settings/users/users.component';
import {ProfileComponent} from './profile/profile.component';
import {SecurityComponent} from './security/security.component';
import {GeneralAccessComponent} from './settings/general-access/general-access.component';

export const AccountRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'security',
        component: SecurityComponent,
        data: {
          heading: 'Security'
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: {
          heading: 'Settings'
        },
        children: [
          {path: '', redirectTo: 'calendar-options'},
          {
            path: 'calendar-options',
            component: CalendarOptionsComponent
          },
          {
            path: 'access-control',
            component: UsersComponent
          },
          {
            path: 'general-access',
            component: GeneralAccessComponent
          }
        ]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          heading: 'Profile'
        }
      }
    ]
  }
];
