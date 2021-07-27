import { Routes } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SignoutComponent}  from './signout/signout.component';
import { SuperAdminComponent}  from './super-admin/super-admin.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'signin',
      component: SigninComponent
    }, {
      path: 'signout',
      component: SignoutComponent
    }, {
      path: 'signup',
      component: SignupComponent
    }, {
      path: 'forgot',
      component: ForgotComponent
    }, {
      path: 'super-admin',
      component: SuperAdminComponent
    }, {
      path: 'lockscreen',
      component: LockscreenComponent
    }]
  }
];
