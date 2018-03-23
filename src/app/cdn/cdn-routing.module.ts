import { Routes, RouterModule } from '@angular/router';

import { CdnComponent } from './cdn.component';

import { MMonitoringComponent } from './monitoring/monitoring.component';


export const CdnRoutes: Routes = [
{
	path: '',
	component: CdnComponent,
	children: [
	{path: '', redirectTo: '/app/cdn/performance', pathMatch: 'full'},
	{path: 'performance', component: MMonitoringComponent }
	// {path: '**', redirectTo: '/app/cdn/performance' }
	]
}
];

export const CdnRoutingModule = RouterModule.forChild(CdnRoutes);

