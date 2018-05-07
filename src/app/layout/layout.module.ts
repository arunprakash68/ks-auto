import { NgModule } from '@angular/core';

import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MyDashboardComponent } from '../my-dashboard/my-dashboard.component'



@NgModule({
  imports: [
    LayoutRoutingModule,
    SharedModule,
  ],
  declarations: [MyDashboardComponent]
})

export class LayoutModule {}
