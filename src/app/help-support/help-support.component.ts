import { Component, OnInit } from '@angular/core';
import { APPCONFIG } from '../config';

@Component({
  selector: 'app-help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.scss']
})
export class HelpSupportComponent implements OnInit {
  public AppConfig: any;
  supportTab: any;
  tableView: boolean = true;
  engineerTableView: boolean = true;
  ticketView: string = "Graph View";
  engView: string = "Graph View";

  constructor() {
    this.supportTab = {
      active: true
    };
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

  ngOnInit() {
    this.AppConfig = APPCONFIG;
  }

}
