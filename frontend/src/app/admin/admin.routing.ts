import {Routes} from '@angular/router';
import {ApplicationComponent} from './application/application.component';
import {PhysicianComponent} from './physician/physician.component';
import {QuickbooksComponent} from './quickbooks/quickbooks.component';
import {ReferralComponent} from './referral/referral.component';
import {ServiceCodeComponent} from './service-code/service-code.component';
import {CustomFieldsComponent} from './custom-fields/custom-fields.component';
import {CaseManagerComponent} from './case-manager/case-manager.component';
import {AlertsComponent} from './alerts/alerts.component';
import {MasterListComponent} from './master-list/master-list.component';
import {SupDivision} from './supdivision/supdivision.component';
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

export const AdminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'application',
        component: ApplicationComponent,
        data: {
          heading: 'Application'
        }
      },
      {
        path: 'master-list',
        component: MasterListComponent,
        children: [
          {path: '', redirectTo: 'reminders'},
          {
            path: 'reminders',
            component: ReminderMasterListComponent
          },
          {
            path: 'case-manager',
            component: CaseManagerMasterListComponent
          },
          {
            path: 'client-type',
            component: ClientTypeMasterListComponent
          },
          {
            path: 'classification',
            component: ClassificationMasterListComponent
          },
          {
            path: 'note-type-client',
            component: NoteTypeClientMasterListComponent
          },
          {
            path: 'note-type-caregiver',
            component: NoteTypeCaregiverMasterListComponent
          },
          {
            path: 'reasons',
            component: ReasonsMasterListComponent
          },
          {
            path: 'county',
            component: CountyMasterListComponent
          },
          {
            path: 'service',
            component: ServiceMasterListComponent
          },
          {
            path: 'physician',
            component: PhysicianMasterListComponent
          },
          {
            path: 'refferals',
            component: ReferralMasterListComponent
          },
          {
            path: 'agencies',
            component: AgenciesMasterListComponent
          },
          {
            path: 'skills',
            component: SkillMasterListComponent
          },
          {
            path: 'availabilities',
            component: AvailabilityMasterListComponent
          },
          {
            path: 'languages',
            component: LanguageMasterListComponent
          },
          {
            path: 'message-templates',
            component: MessageTemplatesMasterListComponent
          },
          {
            path: 'phone-numbers',
            component: PhonenumberMasterListComponent
          },
          {
            path: 'security-users',
            component: SecurityuserMasterListComponent
          }
        ],
        data: {
          heading: 'Master List'
        }
      },
      {
        path: 'physician',
        component: PhysicianComponent,
        data: {
          heading: 'Physician'
        }
      },
      {
        path: 'page404',
        component: Page404Component,
        data: {
          heading: 'Page Not Found Or Restricted Access'
        }
      },
      {
        path: 'quickbooks',
        component: QuickbooksComponent,
        data: {
          heading: 'Quickbooks'
        }
      },
      {
        path: 'referral',
        component: ReferralComponent,
        data: {
          heading: 'Referral'
        }
      },
      {
        path: 'service-code',
        component: ServiceCodeComponent,
        data: {
          heading: 'Service Code'
        }
      },
      {
        path: 'custom-fields',
        component: CustomFieldsComponent,
        data: {
          heading: 'Custom Fields'
        }
      },
      {
        path: 'case-manager',
        component: CaseManagerComponent,
        data: {
          heading: 'Case Manager'
        }
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        data: {
          heading: 'Alerts'
        }
      },
      {
        path: 'supdivision',
        component: SupDivision,
        data: {
          heading: 'Division'
        }
      }
    ]
  }
];
