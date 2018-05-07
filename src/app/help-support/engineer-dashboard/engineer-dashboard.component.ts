import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'engineer-dashboard',
  templateUrl: './engineer-dashboard.component.html',
  styleUrls: ['./engineer-dashboard.component.scss']
})
export class EngineerDashboardComponent implements OnInit {

  loading: any;
  totalEngineersInfo: any;
  collectionSize: any;
  pageSize: any;
  page: any;
  rotate: any;
  boundaryLinks: any;
  maxSize: any;
  @Input() ageingParams: any;

  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.loading = false;
    this.page = 1;
    this.pageSize = 16;
    this.maxSize = 5;
    this.rotate = true;
    this.boundaryLinks = true;
    this.collectionSize = 0;
    this.totalEngineersInfo = [
      {
        Engineers: 'Delhi',
        total: '15',
        new: '2',
        inprogress: '3',
        notavailable: '5',
        onhold: '3',
        resolved: '2',
        color: 'red'
      },
      {
        Engineers: 'Mumbai',
        total: '20',
        new: '2',
        inprogress: '6',
        notavailable: '4',
        onhold: '5',
        resolved: '3',
        color: 'red'
      },
      {
        Engineers: 'Kolkata',
        total: '22',
        new: '6',
        inprogress: '3',
        notavailable: '7',
        onhold: '2',
        resolved: '4',
        color: 'red'
      },
      {
        Engineers: 'Pune',
        total: '23',
        new: '5',
        inprogress: '7',
        notavailable: '2',
        onhold: '4',
        resolved: '5',
        color: '#e2c30f'
      },
      {
        Engineers: 'Noida',
        total: '34',
        new: '10',
        inprogress: '5',
        notavailable: '3',
        onhold: '9',
        resolved: '7',
        color: 'red'
      },
      {
        Engineers: 'Total',
        total: '114',
        new: '25',
        inprogress: '24',
        notavailable: '21',
        onhold: '23',
        resolved: '21',
        color: 'red'
      }
    ]

    this.updatePaginationParameters();
  }

  updatePaginationParameters() {
    // if(this.servers['status'] == '0') { return; }
    // this.collectionSize = this.servers['count'];
    this.collectionSize = 6;
    // this.pageItemIndex = (this.page - 1) * this.pageSize;
  }

  pageChange(currPage, searchValue?) {
    this.page = currPage;
    // this.serverSearchParams['start_count'] = (this.page - 1) * this.pageSize;
    // this.serverSearchParams['end_count'] = this.pageSize;
    // if (searchValue) {
    // 	this.serverSearchParams['search_value'] = searchValue;
    // }
    // this.getMyServers();
  }

  ngOnInit() {
  }

  goToDashboard(event: any) {
    localStorage.setItem('EngineerLocation', event);
    localStorage.setItem('SelectedTab', 'engineer');
    this.router.navigate(['/engineerlocationdashboard']);
  }

}
