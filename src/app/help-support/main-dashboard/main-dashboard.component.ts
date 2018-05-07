import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  supportTab: any;
  tableView: boolean = true;
  engineerTableView: boolean = true;
  ticketView: string = "Graph View";
  engView: string = "Graph View";
  tabs: any;
  selectedAgeing: any=1;

  constructor() {
    this.supportTab = {
      active: true
    };

    this.tabs = {
      ticketTab: true,
      engineerTab: false
    };
    if (localStorage.getItem('SelectedTab') && localStorage.getItem('SelectedTab') == 'engineer') {
      this.tabs.ticketTab = false;
      this.tabs.engineerTab = true;
    }
    else {
      this.tabs.ticketTab = true;
      this.tabs.engineerTab = false;
    }

    localStorage.removeItem('EngineerLocation');
    localStorage.removeItem('TicketLocation');
    localStorage.removeItem('EngineerName');

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

  showGraphView() {
    if (this.engineerTableView) {
      this.engineerTableView = !this.engineerTableView;
      this.engView = "Table View";
    }
    else {
      this.engineerTableView = true
      this.engView = "Graph View";
    }
  }

  onAgeingChange() {
    console.log(this.selectedAgeing);
  }
}
