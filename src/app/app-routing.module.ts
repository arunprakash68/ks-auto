import { RouterModule, Routes } from '@angular/router';

import { PageLoginComponent } from './extra-pages/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HelpSupportComponent } from './help-support/help-support.component';
// import { TicketLocationDashboardComponent } from './help-support/ticket-location-dashboard/ticket-location-dashboard.component';
// Page Layouts
import { PageLayoutFullscreenComponent } from './page-layouts/fullscreen/fullscreen.component';

const AppRoutes: Routes = [
  // { path:'', redirectTo: '/login', pathMatch: 'full' },
  { path: '', redirectTo: '/app/my-dashboard', pathMatch: 'full' },
  { path: 'login', component: PageLoginComponent },
  { path: 'helpsupport', component: HelpSupportComponent },
  // { path:'ticketlocationdashboard', component:TicketLocationDashboardComponent},
  { path: 'app', component: LayoutComponent },
  { path: 'fullscreen', component: PageLayoutFullscreenComponent },
  { path: '**', redirectTo: '/app/my-dashboard', pathMatch: 'full' },
 
  // { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

export const AppRoutingModule = RouterModule.forRoot(AppRoutes, { useHash: true });
