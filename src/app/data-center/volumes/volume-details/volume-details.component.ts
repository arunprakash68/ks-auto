import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { ELBService } from '../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'volume-details',
  templateUrl: './volume-details.component.html',
  providers: [ELBService, ErrorHandlerService],
})
export class VolumeDetailsComponent implements OnInit {
  @Input() volumeDetailsList :  any;
	tabsList :  any;
	loading : any;
	desData : any;
  selectMsg : string;
  
  constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router) {
      this.tabsList = [
				{template : 'Description', active: true},
        {template : 'Status Check', active: false},
				{template : 'Monitoring', active: false}
			]
			this.loading = {};
			this.selectMsg = 'Please select single Volume to view details'
   }

   ngOnInit(){
		this.updateDetailsList();
	}

	ngOnChanges(){
		// console.log(this.elbDetailsList)
	}

	onParamUpdate(list){
		this.volumeDetailsList = list;
		this.updateDetailsList();
	}

	updateDetailsList(){
		let keysArr = Object.keys(this.volumeDetailsList)
		this.desData = keysArr.length > 1 ? this.selectMsg : this.volumeDetailsList[keysArr[0]];
	}


}
