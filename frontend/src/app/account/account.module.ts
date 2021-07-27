import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';
import {AccountRoutes} from './account.routing';
import {ProfileComponent} from './profile/profile.component';
import {SettingsComponent} from './settings/settings.component';
import {CalendarOptionsComponent} from './settings/calendar-options/calendar-options.component';
import {UsersComponent} from './settings/users/users.component';
import {GeneralAccessComponent} from './settings/general-access/general-access.component';
import {CustomFormsModule} from 'ng2-validation';
import {TextMaskModule} from 'angular2-text-mask';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SecurityComponent} from './security/security.component';
import {ModalModule} from '../library/custom-modal/modal';
import {SettingsService} from '../services/settings/settings.service';
import {AuthService} from '../services/gaurd/auth.service';
import {DataService} from '../services/db/data.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AccountRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    JsonpModule,
    NgbModule,
    TextMaskModule,
    ModalModule,
    NgxDatatableModule
  ],
  declarations: [
    ProfileComponent,
    SettingsComponent,
    SecurityComponent,
    CalendarOptionsComponent,
    UsersComponent,
    GeneralAccessComponent
  ],
  providers: [SettingsService, DataService, AuthService]
})
export class AccountModule {}
