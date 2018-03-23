import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-certificate',
  templateUrl: './server-certificate.component.html',
})
export class ServerCertificateComponent implements OnInit {
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
