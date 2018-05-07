import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'app-ticket-location-dashboard',
  templateUrl: './ticket-location-dashboard.component.html',
  styleUrls: ['./ticket-location-dashboard.component.scss'],
  providers: [SharedService]
})
export class TicketLocationDashboardComponent implements OnInit {
  location: any;
  ticketView: string = "Graph View";
  tableView: boolean = true;
  ticketLocation: any;
  selectedAgeing:any=1;

  constructor(private _sharedService: SharedService) {
    this.ticketLocation = localStorage.getItem('TicketLocation');
  }

  ngOnInit() {

  }

  changeView() {
    if (this.tableView) {
      this.tableView = !this.tableView;
      this.ticketView = "Table View";
    }
    else {
      this.tableView = true;
      this.ticketView = "Graph View";
    }
  }
}
