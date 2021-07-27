import { Routes } from '@angular/router';
import { Page404Component } from './page404/page404.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';
import { Step7Component } from './step7/step7.component';
import { Step8Component } from './step8/step8.component';

export const RegistrationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'step1',
        component: Step1Component,
        data: {
          heading: 'step1'
        }
      },
      {
        path: 'step2',
        component: Step2Component,
        data: {
          heading: 'step2'
        }
      },
      {
        path: 'step3',
        component: Step3Component,
        data: {
          heading: 'step3'
        }
      },
      {
        path: 'step4',
        component: Step4Component,
        data: {
          heading: 'step4'
        }
      },
      {
        path: 'step5',
        component: Step5Component,
        data: {
          heading: 'step5'
        }
      },
      {
        path: 'step6',
        component: Step6Component,
        data: {
          heading: 'step6'
        }
      },
      {
        path: 'step7',
        component: Step7Component,
        data: {
          heading: 'step7'
        }
      },
      {
        path: 'step8',
        component: Step8Component,
        data: {
          heading: 'step8'
        }
      },
      {
        path: 'page404',
        component: Page404Component,
        data: {
          heading: 'Page Not Found Or Restricted Access'
        }
      },
    ]
  }
];
