import { Routes, RouterModule } from '@angular/router';

import { ProcessComponent } from './process.component';
import { ProcessChangeRequestComponent } from './change-request/change-request.component';

export const ProcessRoutes: Routes = [
	{
		path: '',
		component: ProcessComponent,
		children: [
			{path: '', redirectTo: '/app/dashboard', pathMatch: 'full'},
			{path: 'change-request', component: ProcessChangeRequestComponent }
		]
	}
]

export const ProcessRoutingModule = RouterModule.forChild(ProcessRoutes);