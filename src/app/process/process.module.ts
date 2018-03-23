import { NgModule } from '@angular/core';

import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process.component';

import { ProcessChangeRequestComponent } from './change-request/change-request.component';

@NgModule({
	imports: [
		ProcessRoutingModule
	],
	declarations: [
		ProcessComponent,
		ProcessChangeRequestComponent
	]
})

export class ProcessModule {}