import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DragulaModule} from 'ng2-dragula';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule} from '../library/custom-modal/modal';

import {DashboardComponent} from './dashboard.component';
import {DashboardRoutes} from './dashboard.routing';

@NgModule({
  imports: [
    CommonModule,
    DragulaModule.forRoot(),
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    ModalModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
