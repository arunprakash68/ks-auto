import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'location-table-list',
  templateUrl: './location-table-list.component.html',
  styleUrls: ['./location-table-list.component.scss']
})
export class LocationTableListComponent implements OnInit {
  loading: any;
  ticketLocationInfo: any;
  collectionSize: any;
  pageSize: any;
  page: any;
  rotate: any;
  boundaryLinks: any;
  maxSize: any;
  location: any;
  ticketName?: any;
  ticketLoggedDate?: any;
  @Input() ageingParams: any;

  constructor() {
    this.loading = false;
    this.page = 1;
    this.pageSize = 16;
    this.maxSize = 5;
    this.rotate = true;
    this.boundaryLinks = true;
    this.collectionSize = 0;


    this.ticketLocationInfo = [
      {
        tickets: 'Ticket..1',
        assignedto: 'Engineer 1',
        loggeddata: '6-Apr-18',
        lastupdate: '6-Apr-18',
        priority: 'P1',
        status: 'Inprogress',
        onhold: 'NA',
        ticketcolor: '#f1ba33'
      },
      {
        tickets: 'Ticket..2',
        assignedto: 'Engineer 2',
        loggeddata: '6-Apr-18',
        lastupdate: '6-Apr-18',
        priority: 'P2',
        status: 'Inprogress',
        onhold: 'NA',
        ticketcolor: '#5dab5c'
      },
      {
        tickets: 'Ticket..3',
        assignedto: 'Engineer 3',
        loggeddata: '7-Apr-18',
        lastupdate: '8-Apr-18',
        priority: 'P3',
        status: 'Inprogress',
        onhold: 'NA',
        ticketcolor: '#e42e1c'
      },
      {
        tickets: 'Ticket..4',
        assignedto: 'Engineer 4',
        loggeddata: '7-Apr-18',
        lastupdate: '9-Apr-18',
        priority: 'P4',
        status: 'User Not Available',
        onhold: 'NA',
        ticketcolor: '#ffcd02'
      },
      {
        tickets: 'Ticket..5',
        assignedto: 'Engineer 5',
        loggeddata: '9-Apr-18',
        lastupdate: '10-Apr-18',
        priority: 'P5',
        status: 'Inprogress',
        onhold: 'NA',
        ticketcolor: '#e42e1c'
      },
      {
        tickets: 'Ticket..6',
        assignedto: 'Engineer 6',
        loggeddata: '8-Apr-18',
        lastupdate: '9-Apr-18',
        priority: 'P6',
        status: 'On Hold',
        onhold: 'NA',
        ticketcolor: '#5dab5c'
      },
      {
        tickets: 'Ticket..7',
        assignedto: 'Engineer 7',
        loggeddata: '8-Apr-18',
        lastupdate: '9-Apr-18',
        priority: 'P7',
        status: 'On Hold',
        onhold: 'NA',
        ticketcolor: '#ffcd02'
      },
      {
        tickets: 'Ticket..8',
        assignedto: 'Engineer 8',
        loggeddata: '3-Apr-18',
        lastupdate: '2-Apr-18',
        priority: 'P8',
        status: 'Inprogress',
        onhold: 'NA',
        ticketcolor: '#f1ba33'
      },
    ]

    this.updatePaginationParameters();

    console.log("Location Tab", localStorage.getItem('TicketLocation'));
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

  tikcetDetails(modal, name, date) {
    this.ticketLoggedDate = date;
    this.ticketName = name;
    modal.show();
  }
}
