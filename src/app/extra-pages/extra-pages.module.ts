import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//Services
// import { AuthenticationService } from '../_services/authentication.service';

import { ExtraPagesRoutingModule } from './extra-pages-routing.module';

import { PageLoginComponent } from './login/login.component';
import { PageSignUpComponent } from './sign-up/sign-up.component';
import { PageForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { Page404Component } from './404/404.component';
import { Page500Component } from './500/500.component';
import { PageConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { PageLockScreenComponent } from './lock-screen/lock-screen.component';
import { PageMaintenanceComponent } from './maintenance/maintenance.component';

@NgModule({
  imports: [
    ExtraPagesRoutingModule,
    MaterialModule,
    CommonModule,
    FormsModule
  ],
  declarations: [
    // AuthenticationService,
    PageLoginComponent,
    PageSignUpComponent,
    PageForgotPasswordComponent,
    Page404Component,
    Page500Component,
    PageConfirmEmailComponent,
    PageLockScreenComponent,
    PageMaintenanceComponent,
  ]
  // exports: [PageLoginComponent]
})

export class ExtraPagesModule {}
