import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { DataCenterModule } from '../data-center/data-center.module';
// import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup/src/datetime-popup.module';
import { DateTimePickerModule} from 'ngx-datetime-picker';
import { MMonitoringComponent } from './monitoring/monitoring.component';
import { LogsClickComponent } from './monitoring/logs-click/logs-click.component';
import { ServerLogslistComponent } from './monitoring/logs-click/logs-list/logs-list.component';
import { LogsFilterFormComponent } from './monitoring/logs-click/logs-filter-form/logs-filter-form.component';
import { PerformanceFilterFormComponent } from './monitoring/filter-form/filter-form.component';
import { CdnRoutingModule } from './cdn-routing.module';
import { CdnComponent } from './cdn.component';
// import { StackLineGraphComponent } from '../shared/stack-line-graph/stack-line-graph.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { Top10UrlsComponent } from './monitoring/logs-click/top10-urls/top10-urls.component';
import { PerformanceGraphComponent } from './monitoring/logs-click/performance-graph/performance-graph.component';

@NgModule({
  imports: [
    NgbModule,
    PipesModule,
    TabsModule,
  	FormsModule,
  	CommonModule,
    SharedModule,
    CdnRoutingModule,
    DataCenterModule,
    DateTimePickerModule,
    SharedDirectivesModule,
    // DatetimePopupModule,
    AngularFontAwesomeModule
  ],
  declarations: [
  	CdnComponent,
    MMonitoringComponent,
    // StackLineGraphComponent,
    PerformanceFilterFormComponent,
    LogsClickComponent,
    ServerLogslistComponent,
    LogsFilterFormComponent,
    Top10UrlsComponent,
    PerformanceGraphComponent
  ]
})

export class CdnModule {}
