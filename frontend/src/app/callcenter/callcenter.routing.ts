import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';

export const CallcenterRoutes: Routes = [{
  path: '',
  children: [
    {
		path: 'list',
		component: ListComponent,
		data: {
		  heading: 'Call Center'
	  }
	}
	]
}];
