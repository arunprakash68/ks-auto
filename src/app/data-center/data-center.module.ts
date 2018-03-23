import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule, ProgressbarModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { DataCenterRoutingModule } from './data-center-routing.module';
import { DataCenterComponent } from './data-center.component';


import { DataCenterServerComponent } from './server/server.component';
import { SummaryTileComponent } from './server/summary-tile/summary-tile.component';
import { NewServerComponent } from './server/new-server/new-server.component';
import { ServerslistComponent } from './server/servers-list/servers-list.component';
import { ServerSummaryListComponent } from './server/summary-list/summary-list.component';
import { ServerUpdateFormComponent } from './server/server-update-form/server-update-form.component';
import { StoragelistComponent } from './storage/storage-list/storage-list.component';
import { ServerFilterFormComponent } from './server/filter-form/filter-form.component';
import { ServerStatsComponent } from './server/server-stats/server-stats.component';
import { ClusterslistComponent } from './cluster/clusters-list/clusters-list.component';
import { ClusterFilterFormComponent } from './cluster/cluster-filter-form/cluster-filter-form.component';

import { ImageTextBoxComponent } from '../shared/img-text-box/img-text-box.component';
import { TextTagComponent } from '../shared/text-tag/text-tag.component';
import { VMTypeInfoComponent } from './server/new-server/vm-type-info/vm-type-info.component';
import { ServerAlertslistComponent } from './server/alerts-list/alerts-list.component';
import { ServerStackLineGraphComponent } from './server/server-stats/stack-line-graph/stack-line-graph.component';
// import { StackLineGraphComponent } from '../shared/stack-line-graph/stack-line-graph.component';
import { DataCenterClusterComponent } from './cluster/cluster.component';
import { DataCenterStorageComponent } from './storage/storage.component';
import { DataCenterMyDashboardComponent } from './my-dashboard/my-dashboard.component';

import { ELBComponent } from './elb/vip/elb.component';
import { ELBListComponent } from './elb/vip/elb-list/elb-list.component';
import { NewELBComponent } from './elb/new-elb/new-elb.component';
import { CreateVipComponent } from './elb/new-elb/create-vip/create-vip.component';
import { CreatePoolComponent } from './elb/new-elb/create-pool/create-pool.component';
import { CreateMonitorComponent } from './elb/new-elb/create-monitor/create-monitor.component';
import { ELBFilterFormComponent } from './elb/vip/filter-form/filter-form.component';

import { CostModule } from '../cost/cost.module';

import { SharedDirectivesModule } from '../directives/shared-directives.module';

import { AvatarModule } from 'ngx-avatar';
import { ServerCertificateComponent } from './elb/ssl/server-certificate/server-certificate.component';
import { ClientCertificateComponent } from './elb/ssl/client-certificate/client-certificate.component';
import { CaCertificateComponent } from './elb/ssl/ca-certificate/ca-certificate.component';
import { ServerCertificateListComponent } from './elb/ssl/server-certificate/server-certificate-list/server-certificate-list.component';
import { ClientCertificateListComponent } from './elb/ssl/client-certificate/client-certificate-list/client-certificate-list.component';
import { CaCertificateListComponent } from './elb/ssl/ca-certificate/ca-certificate-list/ca-certificate-list.component';
import { PoolComponent } from './elb/pool/pool.component';
import { PoolListComponent } from './elb/pool/pool-list/pool-list.component';


@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    FormsModule,
    AngularFontAwesomeModule,
    NgbModule,
    TabsModule,
    ProgressbarModule,
    ModalModule,
    CommonModule,
    DataCenterRoutingModule,
    MaterialModule,
    CostModule,
    SharedDirectivesModule,
    AvatarModule,
  ],
  declarations: [
    DataCenterComponent,
    DataCenterServerComponent,
    SummaryTileComponent,
    NewServerComponent,
    ImageTextBoxComponent,
    TextTagComponent,
    VMTypeInfoComponent,
    ServerUpdateFormComponent,
    ServerslistComponent,
    ServerSummaryListComponent,
    StoragelistComponent,
    ServerStatsComponent,
    ServerAlertslistComponent,
    ServerStackLineGraphComponent,
    // StackLineGraphComponent,
    ServerFilterFormComponent,
    ClusterslistComponent,
    ClusterFilterFormComponent,
    DataCenterClusterComponent,
    DataCenterStorageComponent,
    DataCenterMyDashboardComponent,
    ELBComponent,
    ELBListComponent,
    NewELBComponent,
    CreateVipComponent,
    CreatePoolComponent,
    CreateMonitorComponent,
    ELBFilterFormComponent,
    ServerCertificateComponent,
    ClientCertificateComponent,
    CaCertificateComponent,
    ServerCertificateListComponent,
    ClientCertificateListComponent,
    CaCertificateListComponent,
    PoolComponent,
    PoolListComponent
  ]
})

export class DataCenterModule {}

