import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {RegistrationRoutes} from './registration.routing';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DataService} from '../services/db/data.service';
import {ModalModule} from '../library/custom-modal/modal';

import {SharedModule} from '../shared/shared.module';
import {AgGridModule} from 'ag-grid-angular';
import {WebcamModule} from 'ngx-webcam';

import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Page404Component } from './page404/page404.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';
import { Step7Component } from './step7/step7.component';
import { Step8Component } from './step8/step8.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RegistrationRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule,
    ModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxLoadingModule.forRoot({}),
    NgxDatatableModule,
    AgGridModule.withComponents([]),
    SharedModule,
    WebcamModule
  ],
  declarations: [
    Page404Component,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    Step7Component,
    Step8Component
  ],
  providers: [DataService]
})
export class RegistrationModule {}
//
