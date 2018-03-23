import { NgModule } from '@angular/core';

import { LocalItRoutingModule } from './local-it-routing.module';
import { LocalItComponent } from './local-it.component';

import { LocalItMyAssetsComponent } from './my-assets/my-assets.component';
import { LocalItMyTicketsComponent } from './my-tickets/my-tickets.component';

@NgModule({
	imports: [
		LocalItRoutingModule
	],
	declarations: [
		LocalItComponent,
		LocalItMyAssetsComponent,
		LocalItMyTicketsComponent
	]
})

export class LocalItModule {}