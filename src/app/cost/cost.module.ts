import { NgModule } from '@angular/core';

import { MaterialModule } from '@angular/material';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { SharedDirectivesModule } from '../directives/shared-directives.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PipesModule } from '../pipes/pipes.module';

import { DateTimePickerModule} from 'ngx-datetime-picker';

import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { CostRoutingModule } from './cost-routing.module';

import { TabsModule, ModalModule } from 'ngx-bootstrap';

import { CostComponent } from './cost.component';

import { CostDiTypeComponent } from './di-type/di-type.component';

import { InfraBillingComponent } from './billing/billing.component';

import { InfraBillingListComponent } from './billing/infra-billing-list/infra-billing-list.component';

import { InfraBillingFilterFormComponent } from './billing/infra-billing-filter-form/infra-billing-filter-form.component';

import { PhysicalBillingComponent } from './physical-billing/physical-billing.component';

import { PhysicalBillingListComponent } from './physical-billing/physical-billing-list/physical-billing-list.component';

import { PhysicalBillingFilterFormComponent } from './physical-billing/physical-billing-filter-form/physical-billing-filter-form.component';

import { PhysicalBillingUpdateFormComponent } from './physical-billing/physical-billing-update-form/physical-billing-update-form.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		CostRoutingModule,
		DateTimePickerModule,
		TabsModule,
		ModalModule,
		PipesModule,
		NgbModule,
		AngularFontAwesomeModule,
		SharedDirectivesModule
	],
	declarations: [
		CostComponent,
		CostDiTypeComponent,
		InfraBillingComponent,
		InfraBillingListComponent,
		InfraBillingFilterFormComponent,
		PhysicalBillingComponent,
		PhysicalBillingListComponent,
		PhysicalBillingFilterFormComponent,
		PhysicalBillingUpdateFormComponent
	]
})

export class CostModule {}