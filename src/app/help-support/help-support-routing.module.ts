import { Routes, RouterModule } from '@angular/router';
import { HelpSupportComponent } from '../help-support/help-support.component';
import { TicketDashboardComponent } from './ticket-dashboard/ticket-dashboard.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { TicketLocationDashboardComponent } from './ticket-location-dashboard/ticket-location-dashboard.component';
import { EngineerLocationDashboardComponent } from './engineer-location-dashboard/engineer-location-dashboard.component';
import { EngineerDetailsComponent } from './engineer-details/engineer-details.component';
import { EngineerTableViewComponent } from './engineer-table-view/engineer-table-view.component';

export const HelpSupportRoutes: Routes = [
    {
        path: '',
        component: HelpSupportComponent,
        children: [
            {
                path: 'ticketdashboard', component: TicketDashboardComponent
            },
            {
                path: 'ticketlocationdashboard', component: TicketLocationDashboardComponent
            },
            {
                path: 'engineerlocationdashboard', component: EngineerLocationDashboardComponent
            },
            {
                path: 'engineertableview', component: EngineerTableViewComponent
            },
            {
                path: 'engineerdetails', component: EngineerDetailsComponent
            },
            { path: '**', component: MainDashboardComponent, pathMatch: 'full' },



        ]
    }
]

export const HelpSupportRoutingModule = RouterModule.forChild(HelpSupportRoutes);