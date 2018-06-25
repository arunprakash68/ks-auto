import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EChartsDirective } from './echarts.directive';
import { SlimScrollDirective } from './slim-scroll.directive';
import { CommonModule } from '@angular/common';
import { StackLineGraphComponent } from './stack-line-graph/stack-line-graph.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog.component';
import { AlertMessage } from '../shared/alert-message/alert-message.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFontAwesomeModule,
    FormsModule
  ],
  declarations: [
  	EChartsDirective,
    SlimScrollDirective,
    StackLineGraphComponent,
    ConfirmDialog,
    AlertMessage
   ],
  exports: [
    EChartsDirective,
    SlimScrollDirective,
    StackLineGraphComponent,
    ConfirmDialog,
    AlertMessage
  ],
  entryComponents: [
    AlertMessage
]
})

export class SharedModule {}
