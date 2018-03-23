import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-certificate',
  templateUrl: './client-certificate.component.html',
  // styleUrls: ['./clientcertificate.component.scss']
})
export class ClientCertificateComponent implements OnInit {

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
