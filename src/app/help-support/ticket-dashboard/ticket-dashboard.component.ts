import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.scss']
})
export class TicketDashboardComponent implements OnInit {
  loading: any;
  totalTicketsInfo: any;
  collectionSize: any;
  pageSize: any;
  page: any;
  rotate: any;
  boundaryLinks: any;
  maxSize: any;
  returnUrl: string;
  changeColorCode: number = 0;
  @Input() ageingParams: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
    this.loading = false;
    this.page = 1;
    this.pageSize = 16;
    this.maxSize = 5;
    this.rotate = true;
    this.boundaryLinks = true;
    this.collectionSize = 0;



    this.totalTicketsInfo = [
      {
        location: 'Delhi',
        total: '15',
        new: '2',
        inprogress: '3',
        notavailable: '5',
        onhold: '3',
        resolved: '2',
        color: '#5dab5c',
        newcolor: '#e42e1c'
      },
      {
        location: 'Mumbai',
        total: '20',
        new: '2',
        inprogress: '6',
        notavailable: '4',
        onhold: '5',
        resolved: '3',
        color: '#e42e1c',
        newcolor: '#f1ba33'
      },
      {
        location: 'Kolkata',
        total: '22',
        new: '6',
        inprogress: '3',
        notavailable: '7',
        onhold: '2',
        resolved: '4',
        color: '#5dab5c',
        newcolor: '#e42e1c'
      },
      {
        location: 'Pune',
        total: '23',
        new: '5',
        inprogress: '7',
        notavailable: '2',
        onhold: '4',
        resolved: '5',
        color: '#e42e1c',
        newcolor: '#f1ba33'
      },
      {
        location: 'Noida',
        total: '34',
        new: '10',
        inprogress: '5',
        notavailable: '3',
        onhold: '9',
        resolved: '7',
        color: '#f1ba33',
        newcolor: '#5dab5c'
      },
      {
        location: 'Total',
        total: '114',
        new: '25',
        inprogress: '24',
        notavailable: '21',
        onhold: '23',
        resolved: '21',
        color: '#5dab5c',
        newcolor: '#e42e1c'
      }
    ]

    setInterval(() => {    //<<<---    using ()=> syntax
      this.changeColor();

    }, 432000);

    this.updatePaginationParameters();
  }

  changeColor() {
    if (this.changeColorCode == 0) {
      this.totalTicketsInfo[0].color = '#5dab5c';
      this.changeColorCode = 1;
    }
    else if (this.changeColorCode == 1) {
      this.totalTicketsInfo[0].color = '#ffcd02';
      this.changeColorCode = 2;
    }
    else if (this.changeColorCode == 2) {
      this.totalTicketsInfo[0].color = '#f1ba33';
      this.changeColorCode = 3;
    }
    else if (this.changeColorCode == 3) {
      this.totalTicketsInfo[0].color = '#e42e1c';
      this.changeColorCode = 0;
    }

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

  goToTicketDashboard(event: any) {
    localStorage.setItem('TicketLocation', event);
    localStorage.setItem('SelectedTab', 'ticket');
    this.router.navigate(['/ticketlocationdashboard']);
  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';



  }
  ngOnChanges() {

    if (this.ageingParams == 2) {
      this.totalTicketsInfo = [
        {
          location: 'Delhi',
          total: '15',
          new: '2',
          inprogress: '5',
          notavailable: '3',
          onhold: '3',
          resolved: '2',
          color: '#5dab5c',
          newcolor: '#e42e1c'
        },
        {
          location: 'Mumbai',
          total: '20',
          new: '2',
          inprogress: '3',
          notavailable: '4',
          onhold: '5',
          resolved: '6',
          color: '#e42e1c',
          newcolor: '#f1ba33'
        },
        {
          location: 'Kolkata',
          total: '22',
          new: '6',
          inprogress: '3',
          notavailable: '4',
          onhold: '2',
          resolved: '7',
          color: '#5dab5c',
          newcolor: '#e42e1c'
        },
        {
          location: 'Pune',
          total: '23',
          new: '5',
          inprogress: '4',
          notavailable: '5',
          onhold: '7',
          resolved: '2',
          color: '#e42e1c',
          newcolor: '#f1ba33'
        },
        {
          location: 'Noida',
          total: '34',
          new: '10',
          inprogress: '9',
          notavailable: '3',
          onhold: '5',
          resolved: '7',
          color: '#f1ba33',
          newcolor: '#5dab5c'
        },
        {
          location: 'Total',
          total: '114',
          new: '25',
          inprogress: '24',
          notavailable: '19',
          onhold: '22',
          resolved: '24',
          color: '#5dab5c',
          newcolor: '#e42e1c'
        }
      ]
    }
    else if (this.ageingParams == 1) {
      this.totalTicketsInfo = [
        {
          location: 'Delhi',
          total: '15',
          new: '2',
          inprogress: '3',
          notavailable: '5',
          onhold: '3',
          resolved: '2',
          color: '#5dab5c',
          newcolor: '#e42e1c'
        },
        {
          location: 'Mumbai',
          total: '20',
          new: '2',
          inprogress: '6',
          notavailable: '4',
          onhold: '5',
          resolved: '3',
          color: '#e42e1c',
          newcolor: '#f1ba33'
        },
        {
          location: 'Kolkata',
          total: '22',
          new: '6',
          inprogress: '3',
          notavailable: '7',
          onhold: '2',
          resolved: '4',
          color: '#5dab5c',
          newcolor: '#e42e1c'
        },
        {
          location: 'Pune',
          total: '23',
          new: '5',
          inprogress: '7',
          notavailable: '2',
          onhold: '4',
          resolved: '5',
          color: '#e42e1c',
          newcolor: '#f1ba33'
        },
        {
          location: 'Noida',
          total: '34',
          new: '10',
          inprogress: '5',
          notavailable: '3',
          onhold: '9',
          resolved: '7',
          color: '#f1ba33',
          newcolor: '#5dab5c'
        },
        {
          location: 'Total',
          total: '114',
          new: '25',
          inprogress: '24',
          notavailable: '21',
          onhold: '23',
          resolved: '21',
          color: '#5dab5c',
          newcolor: '#e42e1c'
        }
      ]
    }
  }

}
