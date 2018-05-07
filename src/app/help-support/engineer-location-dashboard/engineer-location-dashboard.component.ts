import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-engineer-location-dashboard',
  templateUrl: './engineer-location-dashboard.component.html',
  styleUrls: ['./engineer-location-dashboard.component.scss']
})
export class EngineerLocationDashboardComponent implements OnInit {

  ticketView: string = "Graph View";
  tableView: boolean = true;
  selectedAgeing: any = '1';
  engLocation: any;
  constructor() {
    this.engLocation = localStorage.getItem('EngineerLocation');
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
