import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { ELBService } from '../../../../../_services/data-center/elb.service';
import { ErrorHandlerService } from '../../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'elb-details',
	styles: [],
	providers: [ELBService, ErrorHandlerService],
	templateUrl: './elb-details.component.html'
})


export class ELBDetailsComponent {
	@Input() elbDetailsList :  any;
	tabsList :  any;
	loading : any;
	desData : any;
	selectMsg : string;
	lbEvents :  any;
	timerEvents :  any;
	elbString :  any;


	constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router) {
			this.tabsList = [
				{template : 'description', active: true},
				{template : 'listeners', active: false},
				{template : 'events', active: false},
				{template : 'monitoring', active: false}
			]
			this.loading = {};
			this.lbEvents = {};
			this.elbString = '',
			this.selectMsg = 'Please select single VIP to view details'
	}
	 
	ngOnInit(){
		this.updateDetailsList();
	}

	ngOnChanges(){
		// console.log(this.elbDetailsList)
	}

	onParamUpdate(list){
		this.elbDetailsList = list;
		this.updateDetailsList();
	}

	destroyRefresh(){
		if (this.timerEvents) {
			this.timerEvents.unsubscribe();
		}
	}

	updateDetailsList(){
		let keysArr = Object.keys(this.elbDetailsList);
		let string = keysArr.map(key => {
			return this.elbDetailsList[key].vip
		});
		this.elbString = string.join(' , ')
		this.desData = keysArr.length > 1 ? this.selectMsg : this.elbDetailsList[keysArr[0]];
		if(keysArr.length == 1){
			this.getElbEvents();
		}
		else{
			this.destroyRefresh();
		}
		
	}

	getElbEvents(){
		
		let params = {
			start_time : '',
			end_time : '',
            domid : this.desData.id
        }

		this.elbService.getLBEvents(params).subscribe(data => {

			if (data && data['status'] == 1) {
				
				this.lbEvents['events'] = data.events.sort(function(a,b){
					let date1 = +new Date(b.event_date);
					let date2 = +new Date(a.event_date);
					return date2 - date1;
				});
				
				this.lbEvents['progress'] = data.progress;
				if(this.lbEvents.progress < 100){
					this.loading['lbEvents'] = true;
					this.timerEvents = Observable.timer(10000, 25000).first().subscribe(() => this.getElbEvents());
				}
				else{
					this.loading['lbEvents'] = false;
					this.destroyRefresh();
				}
			} else {
				this.lbEvents = null;
				this.loading['lbEvents'] = false;
			}
			
		}, error => {

			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.lbEvents = null;
			this.loading['lbEvents'] = false;
		});
	}

	ngOnDestroy() {
		this.destroyRefresh();
	}

}
