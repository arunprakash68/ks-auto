import { RouterModule, Routes } from '@angular/router';

import { CostComponent } from './cost.component';

// import { CostDiTypeComponent } from './di-type/di-type.component';

import { InfraBillingComponent } from './billing/billing.component';

export const CostRoutes: Routes = [
	{
		path: '',
		component: CostComponent,
		children: [
			{ path: '', redirectTo: '/app/cost/billing', pathMatch: 'full' },
			// { path: 'di-type', component: CostDiTypeComponent },
			{ path: 'billing', component: InfraBillingComponent }
			// { path: 'asset-billing', component: PhysicalBillingComponent }
		]
	}
]

export const CostRoutingModule = RouterModule.forChild(CostRoutes);