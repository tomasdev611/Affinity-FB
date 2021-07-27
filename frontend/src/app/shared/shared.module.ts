import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {NgSelectModule} from '@ng-select/ng-select';
import {AngularDraggableModule} from 'angular2-draggable';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgxLoadingModule} from 'ngx-loading';
import {DualListBoxModule} from 'ng2-dual-list-box';
import {ModalModule} from '../library/custom-modal/modal';
import {MenuItems} from './menu-items/menu-items';
import {AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective} from './accordion';
import {ToggleFullscreenDirective} from './fullscreen/toggle-fullscreen.directive';
import {CalendarComponent} from './calendar/calendar.component';
import {ChatboxComponent} from './chatbox/chatbox.component';
import {ManageGroupComponent} from './manage-group/manage-group.component';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularDraggableModule,
    NgxDatatableModule,
    DualListBoxModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    CalendarComponent,
    ChatboxComponent,
    ManageGroupComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    CalendarComponent,
    ChatboxComponent,
    ManageGroupComponent
  ],
  providers: [MenuItems]
})
export class SharedModule {}
