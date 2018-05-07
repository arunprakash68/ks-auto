import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'engineer-table-view',
  templateUrl: './engineer-table-view.component.html',
  styleUrls: ['./engineer-table-view.component.scss']
})
export class EngineerTableViewComponent implements OnInit {
  loading: any;
  engineerLocationInfo: any;
  collectionSize: any;
  pageSize: any;
  page: any;
  rotate: any;
  boundaryLinks: any;
  maxSize: any;
  location: any;
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


    this.engineerLocationInfo = [
      {
        Engineer: 'Engineer 1',
        loggedin: 'Yes',
        total: '13',
        inprogress: '3',
        notavailable: '5',
        onhold: '3',
        resolved: '2'
      },
      {
        Engineer: 'Engineer 2',
        loggedin: 'Yes',
        total: '18',
        inprogress: '6',
        notavailable: '4',
        onhold: '5',
        resolved: '3'
      },
      {
        Engineer: 'Engineer 3',
        loggedin: 'Yes',
        total: '16',
        inprogress: '3',
        notavailable: '7',
        onhold: '2',
        resolved: '4'
      },
      {
        Engineer: 'Engineer 4',
        loggedin: 'Yes',
        total: '18',
        inprogress: '7',
        notavailable: '2',
        onhold: '4',
        resolved: '5'
      },
      {
        Engineer: 'Engineer 5',
        loggedin: 'Yes',
        total: '24',
        inprogress: '5',
        notavailable: '3',
        onhold: '9',
        resolved: '7'
      },
      {
        Engineer: 'Engineer 6',
        loggedin: 'No',
        total: '34',
        inprogress: '10',
        notavailable: '14',
        onhold: '6',
        resolved: '4'
      },
    ]

    this.updatePaginationParameters();

    console.log("Engineer Tab", localStorage.getItem('EngineerLocation'));
  }

  ngOnInit() {
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

  goToDetailsDashboard(name: any) {
    localStorage.setItem('EngineerName', name);
    this.router.navigate(['/engineerdetails']);
  }

}
