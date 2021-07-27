import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DragulaModule} from 'ng2-dragula';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NotifierModule} from 'angular-notifier';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SidebarModule} from 'ng-sidebar';
import {NgxLoadingModule} from 'ngx-loading';
import {AngularDraggableModule} from 'angular2-draggable';
import {AgmCoreModule} from '@agm/core';
import {ModalModule} from './library/custom-modal/modal';
// ngrx
import {StoreModule} from '@ngrx/store';
// import { StoreRouterConnectingModule } from '@ngrx/router-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {reducers, metaReducers} from './states/reducers';
import {AuthEffects} from './states/effects/auth.effects';
import {ClientEffects} from './states/effects/client.effects';
import {CaregiverEffects} from './states/effects/caregiver.effects';
import {UserEffects} from './states/effects/user.effects';
import {CommonEffects} from './states/effects/common.effects';
import {CalendarEffects} from './states/effects/calendar.effects';
import {MessageEffects} from './states/effects/message.effects';
import {ComplianceEffects} from './states/effects/compliance.effects';

// app imports
import {environment} from '../environments/environment';

import {AppRoutes} from './app.routing';
import {AppComponent} from './app.component';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {RegistrationLayoutComponent} from './layouts/registration/registration-layout.component';
import {ChatBoxContainer} from './layouts/admin/chat-box-container/chat-box-container.component';
import {AuthLayoutComponent} from './layouts/auth/auth-layout.component';
import {SharedModule} from './shared/shared.module';
import {AuthService} from './services/gaurd/auth.service';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {UserService} from './services/db/user.service';
import {ClientService} from './services/db/client.service';
import {CaregiverService} from './services/db/caregiver.service';
import {CalendarService} from './services/db/calendar.service';
import {UtilsService} from './services/db/utils.service';
import {MasterformService} from './services/db/masterform.service';
import {MessageService} from './services/db/message.service';
import {BusinessService} from './services/db/business.service';
import {CommonService} from './services/db/common.service';
import {ComplianceService} from './services/db/compliance.service';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
// import { DetailsComponent } from './client/details/details.component';
import {DataService} from './services/db/data.service';
import { RegistrationService } from './services/db/registration.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, AdminLayoutComponent, RegistrationLayoutComponent, AuthLayoutComponent, ChatBoxContainer],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes, {useHash: true}),
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    DragulaModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey
    }),
    ModalModule,
    // ngrx
    // StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([
      AuthEffects,
      ClientEffects,
      CaregiverEffects,
      UserEffects,
      CommonEffects,
      CalendarEffects,
      MessageEffects,
      ComplianceEffects
    ]),
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10
        }
      },
      behaviour: {
        autoHide: 3000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 4
      }
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    AngularDraggableModule
  ],
  providers: [
    AuthService,
    UserService,
    CaregiverService,
    RegistrationService,
    ClientService,
    BusinessService, // DetailsComponent,
    DataService,
    CalendarService,
    UtilsService,
    MasterformService,
    MessageService,
    CommonService,
    ComplianceService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
