import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';
import {AngularDraggableModule} from 'angular2-draggable';
import {NgSelectModule} from '@ng-select/ng-select';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {MessageRoutes} from './message.routing';
import {ListComponent} from './list/list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DataService} from '../services/db/data.service';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../environments/environment';
import {SharedModule} from '../shared/shared.module';
import {AgGridModule} from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MessageRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({}),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey
    }),
    JsonpModule,
    NgSelectModule,
    NgbModule,
    NgxDatatableModule,
    AgGridModule.withComponents([]),
    AngularDraggableModule,
    SharedModule
  ],
  declarations: [ListComponent],
  providers: [ListComponent, DataService]
})
export class MessageModule {}
