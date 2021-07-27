import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';

import {AuthenticationRoutes} from './authentication.routing';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {ForgotComponent} from './forgot/forgot.component';
import {LockscreenComponent} from './lockscreen/lockscreen.component';
import {SignoutComponent} from './signout/signout.component';
import {SuperAdminComponent} from './super-admin/super-admin.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthenticationRoutes),
    FormsModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [
    SigninComponent,
    SignupComponent,
    ForgotComponent,
    LockscreenComponent,
    SignoutComponent,
    SuperAdminComponent
  ]
})
export class AuthenticationModule {}
