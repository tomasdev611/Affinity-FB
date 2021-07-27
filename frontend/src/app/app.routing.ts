import {Routes} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {RegistrationLayoutComponent} from './layouts/registration/registration-layout.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {AuthService} from './services/gaurd/auth.service';

export const AppRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthService]
      },
      {
        path: 'account',
        loadChildren: './account/account.module#AccountModule',
        canActivate: [AuthService]
      },
      {
        path: 'reports',
        loadChildren: './reports/reports.module#ReportsModule',
        canActivate: [AuthService]
      },
      {
        path: 'callcenter',
        loadChildren: './callcenter/callcenter.module#CallcenterModule',
        canActivate: [AuthService]
      },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#AdminModule',
        canActivate: [AuthService]
      },
      {
        path: 'client',
        loadChildren: './client/client.module#ClientModule',
        canActivate: [AuthService]
      },
      {
        path: 'caregiver',
        loadChildren: './caregiver/caregiver.module#CaregiverModule',
        canActivate: [AuthService]
      },
      {
        path: 'chatrooms',
        loadChildren: './messages/message.module#MessageModule',
        canActivate: [AuthService]
      },
      {
        path: 'schedule',
        loadChildren: './schedule/schedule.module#ScheduleModule',
        canActivate: [AuthService]
      },
      {
        path: 'help',
        loadChildren: './help/help.module#HelpModule',
        canActivate: [AuthService]
      },
      {
        path: 'docs',
        loadChildren: './docs/docs.module#DocsModule'
      }
    ]
  },
  {
    path: '',
    component: RegistrationLayoutComponent,
    children: [
      {
        path: 'registration',
        loadChildren: './registration/registration.module#RegistrationModule',
        canActivate: [AuthService]
      },
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
      },
      {
        path: 'error',
        loadChildren: './error/error.module#ErrorModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];
