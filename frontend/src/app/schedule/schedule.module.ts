import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ScheduleRoutes} from './schedule.routing';
import {ListComponent} from './list/list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SharedModule} from '../shared/shared.module';
import {ScheduleCalendarComponent} from './calendar/calendar.component';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ScheduleRoutes),
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [ListComponent, ScheduleCalendarComponent]
})
export class ScheduleModule {}
