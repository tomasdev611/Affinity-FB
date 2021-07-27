import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxLoadingModule} from 'ngx-loading';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {ClientRoutes} from './client.routing';
import {ListComponent} from './list/list.component';
import {PotentialComponent} from './potential/potential.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {DetailsComponent} from './details/details.component';
import {PrintComponent} from './print/print.component';
import {DataService} from '../services/db/data.service';
import {ModalModule} from '../library/custom-modal/modal';

import {SharedModule} from '../shared/shared.module';
import {AgGridModule} from 'ag-grid-angular';
import {OverviewComponent} from './details/overview/overview.component';
import {RemindersComponent} from './details/reminders/reminders.component';
import {AttachmentsComponent} from './details/attachments/attachments.component';
import {CustomfieldsComponent} from './details/customfields/customfields.component';
import {ContactsComponent} from './details/contacts/contacts.component';
import {VisitsComponent} from './details/visits/visits.component';
import {NotesComponent} from './details/notes/notes.component';

import {OverviewListComponent} from './details/overview/lists/lists.component';
import {OverviewNotesComponent} from './details/overview/notes/notes.component';
import {OverviewRemindersComponent} from './details/overview/reminders/reminders.component';
import {OverviewAttachmentsComponent} from './details/overview/attachments/attachments.component';
import {OverviewCalendarComponent} from './details/overview/calendar/calendar.component';
import {OverviewContactsComponent} from './details/overview/contacts/contacts.component';

import {LanguagesComponent} from './details/languages/languages.component';
import {AvailabilitiesComponent} from './details/availabilities/availabilities.component';
import {SkillsComponent} from './details/skills/skills.component';

import {DirectionsMiscComponent} from './details/directions-misc/directions-misc.component';
import {ExclusionPreferencesComponent} from './details/exclusions-preferences/exclusion-preferences.component';
import {InterruptionsServiceComponent} from './details/interruptions-service/interruptions-service.component';
import {PlanOfCareComponent} from './details/plan-of-care/plan-of-care.component';
import {ServiceOrdersComponent} from './details/service-orders/service-orders.component';
import {SupervisoryVisitsComponent} from './details/supervisory-visits/supervisory-visits.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ClientRoutes),
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
    SharedModule
  ],
  declarations: [
    ListComponent,
    PotentialComponent,
    DetailsComponent,
    PrintComponent,
    OverviewComponent,
    RemindersComponent,
    AttachmentsComponent,
    CustomfieldsComponent,
    ContactsComponent,
    VisitsComponent,
    NotesComponent,
    OverviewListComponent,
    OverviewNotesComponent,
    OverviewRemindersComponent,
    OverviewAttachmentsComponent,
    OverviewContactsComponent,
    LanguagesComponent,
    AvailabilitiesComponent,
    SkillsComponent,
    OverviewCalendarComponent,
    DirectionsMiscComponent,
    ExclusionPreferencesComponent,
    InterruptionsServiceComponent,
    PlanOfCareComponent,
    ServiceOrdersComponent,
    SupervisoryVisitsComponent
  ],
  providers: [DataService]
})
export class ClientModule {}
//
