import { NgModule } from '@angular/core';

import { DynamicAccordianDirective } from './dynamic-accordion.directive';
import { ExpandableContainerDirective } from './expandable-container.directive';
import { ColResizeDirective } from './col-resizable.directive';

@NgModule({
	imports: [],
	declarations: [
		DynamicAccordianDirective,
		ExpandableContainerDirective,
		ColResizeDirective
	],
	exports: [
		DynamicAccordianDirective,
		ExpandableContainerDirective,
		ColResizeDirective
	]
})

export class SharedDirectivesModule {}