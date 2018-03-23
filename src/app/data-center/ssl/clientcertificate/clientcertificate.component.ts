import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientcertificate',
  templateUrl: './clientcertificate.component.html',
  // styleUrls: ['./clientcertificate.component.scss']
})
export class ClientcertificateComponent implements OnInit {

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
