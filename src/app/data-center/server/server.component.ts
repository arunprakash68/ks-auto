import { Component, OnInit, Output, EventEmitter, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ServerslistComponent } from './servers-list/servers-list.component';
import { ServerFilterFormComponent } from './filter-form/filter-form.component';
import { ServerStatsComponent } from './server-stats/server-stats.component';
import { ServerListService } from '../../_services/servers-list.service';
import { ServicesUtilityService } from '../../_services/services-utility.service';

@Component({
	selector: 'data-center-server',
	styles: [],
	providers: [ServerListService],
  // changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './server-simple.component.html'
})


export class DataCenterServerComponent implements OnInit {
  staticServerTab: any;
  dynamicTabs: any[];
  config: any;
  pageSize: number;
  page: number;
  maxSize: number;
  rotate: boolean;
  collectionSize: number;
  boundaryLinks: boolean;
  pageItemIndex: number;
  isCollapsed: boolean;
  searchOptions: any;
  searchTags: any;
  loading: boolean;
  callResize: boolean;
  selectedServerData: any;
  serverSummary: any;
  serverSummaryLoading: boolean;
  serverSummaryError: boolean;
  summaryTab: boolean;
  widgets: any;
  
  constructor(private cdRef:ChangeDetectorRef,
    private serverListService: ServerListService,
    private servicesUtilityService: ServicesUtilityService,
    private activatedRoute: ActivatedRoute) {
    this.isCollapsed = false;
    this.widgets = [
      {title: 'Alerts', count: 10, color: '#3F51B5'},
      {title: 'Issues', count: 20, color: '#4CAF50'},
      {title: 'Performance', count: 20, color: '#2196F3'},
      {title: 'Actions', count: 15, color: '#E91E63'},
    ];
    this.searchOptions = {};
    this.searchTags = [];
    this.dynamicTabs = [];
    this.staticServerTab = {
      active: true
    };
    this.serverSummaryLoading = true;
    this.serverSummaryError = false;
    this.summaryTab = true;
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  ngOnInit(){
    // this.getMyServers();
    // this.getMyServerSummary();
    const searchValue = this.activatedRoute.snapshot.queryParamMap.get('search_value');
    if(searchValue) {
      this.searchOptions['search_value'] = searchValue;
      this.updateSearchOptions(this.searchOptions, true);
    }
  }

  triggerFilterCollapse(collapse) {
     this.isCollapsed = !this.isCollapsed;
  }

  toggleSummaryView() {
    this.summaryTab = !this.summaryTab;
  }

  openProjectServers(info) {
    this.searchOptions['project'] = info['PROJECT'];
    this.searchOptions['business'] = 'Gaana';
    this.updateSearchTags();
    this.toggleSummaryView();
  }

  // getTileColor(index) {
  //   if(index % 4 == 0){
  //     return 'ghostwhite';
  //   } else if(index % 4 == 1){
  //     return 'smokewhite';  
  //   } else if(index % 4 == 2) {
  //     return 'floralwhite';
  //   } else {
  //     return 'lightgoldenrodyellow';
  //   }
    
  // }

  // getMyServerSummary() {
  //   this.serverSummaryError = false;
  //   this.serverSummaryLoading = true;
  //   this.serverListService.getMyServersSummary().subscribe(data => {
  //     this.serverSummaryLoading = false;
  //     if(data['status'] != 0) {
  //       this.serverSummary = data;
  //     }
  //   }, error => {
  //     this.serverSummaryLoading = false;
  //     this.serverSummaryError = true;
  //   })
  // }

  addDynamicTab(options) {
    this.staticServerTab['active'] = false;
    const newTabIndex = this.dynamicTabs.length + 1;
    options['disabled'] = false;
    options['removable'] = true;
    this.dynamicTabs.push(options);
    this.dynamicTabs[newTabIndex - 1].active = true;
    document.body.scrollTop = 0;
  }

  openDynamicAlertsTab(triggerAlertsTab) {
    var options = {
      title: this.selectedServerData['hostname'],//Add alerts icon
      tabType: 'alerts',
      serverAlertsParams: {
        host: this.selectedServerData['ip']  
      }
    };
    this.addDynamicTab(options);
  }

  openDynamicStatsTab(triggerStatsTab) {
    if(!triggerStatsTab) return;
    var options = {
      title: this.selectedServerData['hostname'],//Add alerts icon
      tabType: 'stats',
      graphDataParams: {
        ip: this.selectedServerData['ip']
      }
    }
    this.addDynamicTab(options);
  }

  selectServer(serverData) {
    this.selectedServerData = serverData;
  }

  removeTabHandler(tab:any): void {
    const tabIndex = this.dynamicTabs.indexOf(tab);
    this.dynamicTabs.splice(tabIndex, 1);
    if (tabIndex == 0) {
      this.staticServerTab['active'] = true;
    } else {
       this.dynamicTabs[tabIndex - 1].active = true;   
    }
  }

  
  updateSearchOptions(_searchOptions: any, summaryView?): void {
    console.log(_searchOptions);
    if(!summaryView){
      this.isCollapsed = !this.isCollapsed;
    }
    this.searchOptions = _searchOptions;
    this.updateSearchTags();
    if(summaryView){
      this.toggleSummaryView();
    }
  }

  triggerCloseTag(tag) {
    for(let i = 0; i <  this.searchTags.length; i++) {
      if(this.searchTags[i].prop == tag.prop) {
        this.searchTags.splice(i,1);
        break;
      }
    }
    let temp =  JSON.parse(JSON.stringify(this.searchOptions));
    temp[tag.prop] = '';
    this.searchOptions = temp;

    if (tag.prop == 'business' && this.searchOptions['project']) {
      this.triggerCloseTag({prop: 'project'});
    } 
    // else if (tag.prop == 'project' && this.searchOptions['business']) {
    //   this.triggerCloseTag({prop: 'business'});
    // }
  }

  updateSearchTags() {
    this.searchTags = [];
    let tagPool = {
      search_value: true,
      business: true,
      project: true,
      servertype: true,
      env: {
        '2': 'prod',
        '1': 'non prod'
      },
      status: {
        '2': 'down',
        '1': 'up'
      },
      location: {
        '1': 'mumbai',
        '2': 'chennai'
      }
    }
    for(let prop in this.searchOptions) {
      let title = '';
      if(tagPool[prop] && this.searchOptions[prop] != '') {
        switch (prop) {
          case "env":
            title = this.servicesUtilityService.getServerEnvironmentMapping()[this.searchOptions[prop]];
            break;
          case "status":
            title = tagPool['status'][this.searchOptions[prop]];
            break;
          case "location":
            title = tagPool['location'][this.searchOptions[prop]];
            break;  
          default:
            title = this.searchOptions[prop];
            break;
        }
        this.searchTags.push({
          title: title,
          prop: prop,
          closable: true
        });
      }
        
      }
    
  }

  
  openServerFilter(){
    this.isCollapsed = !this.isCollapsed;
  }

}
