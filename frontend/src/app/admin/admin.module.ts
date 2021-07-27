import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServiceCodeComponent} from './service-code/service-code.component';
import {ReferralComponent} from './referral/referral.component';
import {QuickbooksComponent} from './quickbooks/quickbooks.component';
import {PhysicianComponent} from './physician/physician.component';
import {ApplicationComponent} from './application/application.component';
import {RouterModule} from '@angular/router';
import {NgxLoadingModule} from 'ngx-loading';
import {AdminRoutes} from './admin.routing';
import {CustomFieldsComponent} from './custom-fields/custom-fields.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JsonpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TextMaskModule} from 'angular2-text-mask';
import {ModalModule} from '../library/custom-modal/modal';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {CasemanagerService} from '../services/db/casemanager.service';
import {CaseManagerComponent} from './case-manager/case-manager.component';
import {AlertsComponent} from './alerts/alerts.component';
import {MasterListComponent} from './master-list/master-list.component';
import {MasterformService} from '../services/db/masterform.service';
import {SupDivision} from './supdivision/supdivision.component';
import {SuperAdminDivisionService} from '../services/db/superAdminDivision.service';
import {Page404Component} from './page404/page404.component';

import {AgenciesMasterListComponent} from './master-list/agencies/agencies.component';
import {CaseManagerMasterListComponent} from './master-list/case-manager/case-manager.component';
import {ClassificationMasterListComponent} from './master-list/classification/classification.component';
import {ClientTypeMasterListComponent} from './master-list/client-type/client-type.component';
import {CountyMasterListComponent} from './master-list/county/county.component';
import {NoteTypeCaregiverMasterListComponent} from './master-list/note-type-caregiver/note-type-caregiver.component';
import {NoteTypeClientMasterListComponent} from './master-list/note-type-client/note-type-client.component';
import {PhysicianMasterListComponent} from './master-list/physician/physician.component';
import {ReferralMasterListComponent} from './master-list/referrals/referrals.component';
import {ReminderMasterListComponent} from './master-list/reminder/reminder.component';
import {ServiceMasterListComponent} from './master-list/service/service.component';
import {SkillMasterListComponent} from './master-list/skill/skill.component';
import {ReasonsMasterListComponent} from './master-list/status-reasons/status-reasons.component';
import {AvailabilityMasterListComponent} from './master-list/availability/availability.component';
import {LanguageMasterListComponent} from './master-list/language/language.component';
import {MessageTemplatesMasterListComponent} from './master-list/message-templates/message-templates.component';
import {PhonenumberMasterListComponent} from './master-list/phonenumbers/phonenumbers.component';
import {SecurityuserMasterListComponent} from './master-list/securityusers/securityusers.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
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
    ServiceCodeComponent,
    SupDivision,
    ReferralComponent,
    QuickbooksComponent,
    PhysicianComponent,
    ApplicationComponent,
    CustomFieldsComponent,
    CaseManagerComponent,
    AlertsComponent,
    MasterListComponent,
    Page404Component,
    ReminderMasterListComponent,
    AgenciesMasterListComponent,
    CaseManagerMasterListComponent,
    ClassificationMasterListComponent,
    ClientTypeMasterListComponent,
    CountyMasterListComponent,
    NoteTypeCaregiverMasterListComponent,
    NoteTypeClientMasterListComponent,
    PhysicianMasterListComponent,
    ReferralMasterListComponent,
    ServiceMasterListComponent,
    SkillMasterListComponent,
    ReasonsMasterListComponent,
    AvailabilityMasterListComponent,
    LanguageMasterListComponent,
    MessageTemplatesMasterListComponent,
    PhonenumberMasterListComponent,
    SecurityuserMasterListComponent
  ],
  providers: [SuperAdminDivisionService, CasemanagerService, MasterformService, SupDivision]
})
export class AdminModule {}
