import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TabsModule, ProgressbarModule, ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { HelpSupportRoutingModule } from '../help-support/help-support-routing.module';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { EngineerGraphViewComponent } from './engineer-graph-view/engineer-graph-view.component';
import { TicketGraphViewComponent } from './ticket-graph-view/ticket-graph-view.component';
import { EngineerDashboardComponent } from './engineer-dashboard/engineer-dashboard.component';
import { TicketDashboardComponent } from '../help-support/ticket-dashboard/ticket-dashboard.component';
import { TicketLocationDashboardComponent } from './ticket-location-dashboard/ticket-location-dashboard.component';
import { LocationTableListComponent } from './location-table-list/location-table-list.component';
import { LocationGraphViewComponent } from './location-graph-view/location-graph-view.component';
import { EngineerLocationDashboardComponent } from './engineer-location-dashboard/engineer-location-dashboard.component';
import { EngineerTableViewComponent } from './engineer-table-view/engineer-table-view.component';
import { EngineerLocationGraphComponent } from './engineer-location-graph/engineer-location-graph.component';
import { EngineerDetailsComponent } from './engineer-details/engineer-details.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        NgbModule,
        TabsModule,
        ProgressbarModule,
        ModalModule,
        SharedModule,
        HelpSupportRoutingModule,
        FormsModule
    ],
    declarations: [
        TicketDashboardComponent,
        EngineerDashboardComponent,
        TicketGraphViewComponent,
        EngineerGraphViewComponent,
        MainDashboardComponent,
        TicketLocationDashboardComponent,
        LocationTableListComponent,
        LocationGraphViewComponent,
        EngineerLocationDashboardComponent,
        EngineerTableViewComponent,
        EngineerLocationGraphComponent,
        EngineerDetailsComponent]
})

export class HelpSupportModule { }