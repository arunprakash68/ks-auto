import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ca-certificate',
  templateUrl: './ca-certificate.component.html',
})
export class CaCertificateComponent implements OnInit {

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
