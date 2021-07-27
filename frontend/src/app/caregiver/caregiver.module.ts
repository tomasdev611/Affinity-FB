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
import {CaregiverRoutes} from './caregiver.routing';
import {ListComponent} from './list/list.component';
import {SearchConsoleComponent} from './search/search-console.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DetailsComponent} from './details/details.component';
import {DataService} from '../services/db/data.service';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../environments/environment';
import {SharedModule} from '../shared/shared.module';
import {ModalModule} from '../library/custom-modal/modal';
import {AgGridModule} from 'ag-grid-angular';
import {RemindersComponent} from './details/reminders/reminders.component';
import {AttachmentsComponent} from './details/attachments/attachments.component';
import {CustomfieldsComponent} from './details/customfields-new/customfields.component';
import {VisitsComponent} from './details/visits/visits.component';
import {NotesComponent} from './details/notes/notes.component';
import {LanguagesComponent} from './details/languages/languages.component';
import {AvailabilitiesComponent} from './details/availabilities/availabilities.component';
import {SkillsComponent} from './details/skills/skills.component';
import {OverviewComponent} from './details/overview/overview.component';
import {OverviewListComponent} from './details/overview/lists/lists.component';
import {OverviewNotesComponent} from './details/overview/notes/notes.component';
import {OverviewRemindersComponent} from './details/overview/reminders/reminders.component';
import {OverviewAttachmentsComponent} from './details/overview/attachments/attachments.component';
import {OverviewCalendarComponent} from './details/overview/calendar/calendar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CaregiverRoutes),
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
    ModalModule,
    SharedModule
  ],
  declarations: [
    ListComponent,
    DetailsComponent,
    RemindersComponent,
    AttachmentsComponent,
    CustomfieldsComponent,
    VisitsComponent,
    NotesComponent,
    OverviewComponent,
    OverviewListComponent,
    OverviewNotesComponent,
    OverviewRemindersComponent,
    OverviewAttachmentsComponent,
    LanguagesComponent,
    AvailabilitiesComponent,
    SkillsComponent,
    OverviewCalendarComponent,
    SearchConsoleComponent
  ],
  providers: [ListComponent, DetailsComponent, DataService]
})
export class CaregiverModule {}
