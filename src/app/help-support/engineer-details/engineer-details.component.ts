import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-engineer-details',
  templateUrl: './engineer-details.component.html',
  styleUrls: ['./engineer-details.component.scss']
})
export class EngineerDetailsComponent implements OnInit {
  /**
   * Parameter to show or hide the loader.
   */
  loading: any;
  /**
   * To store JSON data for table.
   */
  engineerInfo: any;
  /**
   * parameters for table pagination
   */
  collectionSize: any;
  pageSize: any;
  page: any;
  rotate: any;
  boundaryLinks: any;
  maxSize: any;
  /**
   * To store the selected value from selected aging drop sown. .
   */
  selectedAgeing: any = '1';

  constructor(private route: ActivatedRoute,
    private router: Router) {
    this.loading = false;
    this.page = 1;
    this.pageSize = 16;
    this.maxSize = 5;
    this.rotate = true;
    this.boundaryLinks = true;
    this.collectionSize = 0;


    this.engineerInfo = [
      {
        engineer: 'Engineer 1',
        tickets: 'Ticket 1',
        loggeddate: '6-Apr-18',
        lastupdate: '6-Apr-18',
        status: 'Inprogress',
        onholdreason: 'NA'
      },
      {
        engineer: 'Engineer 1',
        tickets: 'Ticket 5',
        loggeddate: '6-Apr-18',
        lastupdate: '6-Apr-18',
        status: 'On Hold',
        onholdreason: 'Procurment Call'
      },
      {
        engineer: 'Engineer 1',
        tickets: 'Ticket 8',
        loggeddate: '5-Apr-18',
        lastupdate: '5-Apr-18',
        status: 'Inprogress',
        onholdreason: 'NA'
      },
      {
        engineer: 'Engineer 1',
        tickets: 'Ticket 10',
        loggeddate: '4-Apr-18',
        lastupdate: '4-Apr-18',
        status: 'User not available',
        onholdreason: 'NA'
      },
    ]

    this.updatePaginationParameters();

    console.log("Engineer Tab", localStorage.getItem('EngineerLocation'));
  }

  ngOnInit() {
  }

  /**
   * Function to update the pagination parameters.
   */
  updatePaginationParameters() {
    // if(this.servers['status'] == '0') { return; }
    // this.collectionSize = this.servers['count'];
    this.collectionSize = 6;
    // this.pageItemIndex = (this.page - 1) * this.pageSize;
  }

  /**
   * Function to show the table data according to selected page and search value.
   * @param currPage 
   * @param searchValue 
   */
  pageChange(currPage, searchValue?) {
    this.page = currPage;
    // this.serverSearchParams['start_count'] = (this.page - 1) * this.pageSize;
    // this.serverSearchParams['end_count'] = this.pageSize;
    // if (searchValue) {
    // 	this.serverSearchParams['search_value'] = searchValue;
    // }
    // this.getMyServers();
  }

  /**
   * Function to go back to Engineers dashboard according to location.
   */
  goToEngineerTableDashboard() {
    this.router.navigate(['/engineerlocationdashboard']);
  }


}
