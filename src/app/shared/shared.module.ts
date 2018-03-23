import { NgModule } from '@angular/core';

import { EChartsDirective } from './echarts.directive';
import { SlimScrollDirective } from './slim-scroll.directive';
import { CommonModule } from '@angular/common';
import { StackLineGraphComponent } from './stack-line-graph/stack-line-graph.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule
  ],
  declarations: [
  	EChartsDirective,
    SlimScrollDirective,
    StackLineGraphComponent
   ],
  exports: [
    EChartsDirective,
    SlimScrollDirective,
    StackLineGraphComponent
  ]
})

export class SharedModule {}
