import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servercertificate',
  templateUrl: './servercertificate.component.html',
  // styleUrls: ['./servercertificate.component.scss']
})
export class ServercertificateComponent implements OnInit {
  isCollapsed: Boolean;
  staticTab: any;

  constructor() {
    this.isCollapsed = false;
		this.staticTab = {
			active: true
		};
   }

  ngOnInit() {
  }

}
