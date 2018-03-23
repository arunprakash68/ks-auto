import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cacertificate',
  templateUrl: './cacertificate.component.html',
  // styleUrls: ['./cacertificate.component.scss']
})
export class CacertificateComponent implements OnInit {

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
