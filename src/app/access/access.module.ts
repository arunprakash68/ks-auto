import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { AccessRoutingModule } from './access-routing.module';
// import { StackLineGraphComponent } from '../shared/stack-line-graph/stack-line-graph.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { AccessComponent } from './access.component';
import { AdduserFormComponent } from './adduser-form/adduser-form.component';
import { AddaccessFormComponent } from './addaccess-form/addaccess-form.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';


@NgModule({
  imports: [
    NgbModule,
    PipesModule,
    TabsModule,
  	FormsModule,
  	CommonModule,
    SharedModule,
    AccessRoutingModule,
    SharedDirectivesModule,
    // DatetimePopupModule,
    AngularFontAwesomeModule,
    AngularMultiSelectModule
  ],
  declarations: [
  	AccessComponent,
  	AdduserFormComponent,
  	AddaccessFormComponent
  ]
})

export class AccessModule {}
