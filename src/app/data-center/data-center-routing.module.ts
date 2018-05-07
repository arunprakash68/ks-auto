import { Routes, RouterModule } from '@angular/router';

import { DataCenterComponent } from './data-center.component';

import { DataCenterServerComponent } from './server/server.component';
import { VolumesComponent } from './volumes/volumes.component';
import { NewServerComponent } from './server/new-server/new-server.component';
import { DataCenterClusterComponent } from './cluster/cluster.component';
import { DataCenterStorageComponent } from './storage/storage.component';

import { PhysicalBillingComponent } from '../cost/physical-billing/physical-billing.component';

import { ELBComponent } from './elb/vip/elb.component';
import { NewELBComponent } from './elb/new-elb/new-elb.component';
import { ServerCertificateComponent } from './elb/ssl/server-certificate/server-certificate.component';
import { ClientCertificateComponent } from './elb/ssl/client-certificate/client-certificate.component';
import { CaCertificateComponent } from './elb/ssl/ca-certificate/ca-certificate.component';
import { PoolComponent } from './elb/pool/pool.component';

import { ELBOldComponent } from './elb/vip-old/elb.component';
import { NewVolumeComponent } from './volumes/new-volume/new-volume.component';

export const DataCenterRoutes: Routes = [
	{
		path: '',
		component: DataCenterComponent,
		children: [
			{ path: '', redirectTo: '/app/my-dashboard', pathMatch: 'full' },
			// { path: '', redirectTo: '/app/data-center/server', pathMatch: 'full' },
			{ path: 'elb/vip-old', component: ELBOldComponent },
			{ path: 'server', component: DataCenterServerComponent },
			{ path: 'server/new', component: NewServerComponent },
			{ path: 'assets', component: PhysicalBillingComponent },
			{ path: 'elb', component: ELBComponent },
			{ path: 'elb/new', component: NewELBComponent },
			{ path: 'elb/vip', component: ELBComponent },
			{ path: 'ssl/servercerts', component: ServerCertificateComponent },
			{ path: 'ssl/clientcerts', component: ClientCertificateComponent },
			{ path: 'ssl/cacerts', component: CaCertificateComponent },
			{ path: 'cluster', component: DataCenterClusterComponent },
			{ path: 'storage', component: DataCenterStorageComponent },
			{ path: 'storage/new', component: NewServerComponent },
			{ path: 'elb/pool', component: PoolComponent },
			{ path: 'elb/pool/new', component: NewELBComponent },
			{ path: 'volumes', component: VolumesComponent },
			{ path: 'volume/new', component: NewVolumeComponent },
			// {path: '**', redirectTo: '/app/data-center/server' }

		]
	}
];

export const DataCenterRoutingModule = RouterModule.forChild(DataCenterRoutes);

