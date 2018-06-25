import { Routes, RouterModule } from '@angular/router';

import { AccessComponent } from './access.component';



export const AccessRoutes: Routes = [
{
	path: '',
	component: AccessComponent,
	children: [
	{path: '', component: AccessComponent }
	]
}
];

export const AccessRoutingModule = RouterModule.forChild(AccessRoutes);

