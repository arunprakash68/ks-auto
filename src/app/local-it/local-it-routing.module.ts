import { Routes, RouterModule } from '@angular/router';

import { LocalItComponent } from './local-it.component';
import { LocalItMyAssetsComponent } from './my-assets/my-assets.component';
import { LocalItMyTicketsComponent } from './my-tickets/my-tickets.component';

export const LocalItRoutes: Routes = [
	{
		path: '',
		component: LocalItComponent,
		children: [
			{ path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
			{ path: 'my-assets', component: LocalItMyAssetsComponent },
			{ path: 'my-tickets', component: LocalItMyTicketsComponent }
		]
	}
]

export const LocalItRoutingModule = RouterModule.forChild(LocalItRoutes);