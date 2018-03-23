import { Routes, RouterModule } from '@angular/router';

import { DataCenterComponent } from './data-center.component';

import { DataCenterServerComponent } from './server/server.component';
import { NewServerComponent } from './server/new-server/new-server.component';
import { DataCenterClusterComponent } from './cluster/cluster.component';
import { DataCenterStorageComponent } from './storage/storage.component';
import { DataCenterMyDashboardComponent } from './my-dashboard/my-dashboard.component'

import { PhysicalBillingComponent } from '../cost/physical-billing/physical-billing.component';

import { ELBComponent } from './elb/elb.component';
import { NewELBComponent } from './elb/new-elb/new-elb.component';
import { ServercertificateComponent } from './ssl/servercertificate/servercertificate.component';
import { ClientcertificateComponent } from './ssl/clientcertificate/clientcertificate.component';
import { CacertificateComponent } from './ssl/cacertificate/cacertificate.component';


export const DataCenterRoutes: Routes = [
{
	path: '',
	component: DataCenterComponent,
	children: [
	{path: '', redirectTo: '/app/data-center/server', pathMatch: 'full'},
	{path: 'server', component: DataCenterServerComponent },
	{path: 'server/new', component: NewServerComponent },
	{path: 'assets', component: PhysicalBillingComponent },
	{path: 'elb', component: ELBComponent },
	{path: 'elb/new', component: NewELBComponent },
	{path: 'elb/vip', component: ELBComponent },
	{path: 'ssl/servercerts', component: ServercertificateComponent },
	{path: 'ssl/clientcerts', component: ClientcertificateComponent },
	{path: 'ssl/cacerts', component: CacertificateComponent },
	{path: 'cluster', component: DataCenterClusterComponent },
	{path: 'storage', component: DataCenterStorageComponent },
	{path: 'storage/new', component: NewServerComponent },
	// {path: '**', redirectTo: '/app/data-center/server' }
	// {path: 'my-dashboard', component: DataCenterMyDashboardComponent }
	]
}
];

export const DataCenterRoutingModule = RouterModule.forChild(DataCenterRoutes);

