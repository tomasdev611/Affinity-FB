import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

export const TimesheetRoutes: Routes = [{
	path: '',
	children: [
	  {
		path: 'list',
		component: ListComponent,
		data: {
		  heading: 'Timesheets'
	  }
	},
	{
	  path: 'create',
	  component: CreateComponent,
	  data: {
			heading: 'Create'
	  }
	}]
}];
  