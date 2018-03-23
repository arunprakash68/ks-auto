import { NgModule } from '@angular/core';

import { DynamicAccordianDirective } from './dynamic-accordion.directive';

@NgModule({
	imports: [],
	declarations: [
		DynamicAccordianDirective
	],
	exports: [
		DynamicAccordianDirective	
	]
})

export class SharedDirectivesModule {}