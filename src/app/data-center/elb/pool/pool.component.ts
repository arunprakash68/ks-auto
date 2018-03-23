import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pool',
  templateUrl: './pool.component.html',
})
export class PoolComponent implements OnInit {

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
