import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { ELBService } from '../../../../../../_services/data-center/elb.service';
import { DataMapService} from '../../../../../../_services/data-map.service';
import { ErrorHandlerService } from '../../../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Component({
	selector: 'listeners',
	styles: [],
	providers: [ELBService, ErrorHandlerService,DataMapService],
	templateUrl: './listeners.component.html'
})


export class ListenersComponent {
	@Input() desData :  any;
    loading : any;
	listenerList :  any;
	listenersHeaders :  any;


	constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private dataMapService : DataMapService) {
			this.loading = {}
			this.listenersHeaders = [
				{title : '', header : ''},
				{title : 'Listener ID', header : 'Listener ID'},
				{title : 'Security Policy', header : 'Security Policy'},
				{title : 'SSL Certificate', header : 'SSL Certificate'},
				{title : 'Rules', header : 'Rules'},
				{title : 'Created At', header : 'Created At'},
				{title : 'Status', header : 'Status'},
			];
	}
	 
	ngOnInit(){
	}

	ngOnChanges(){
        if(!this.desData.length){
            this.getListeners();
        }
        
	}

	
	// get map
	getMap(value,obj){
		let x = this.dataMapService.getMap(value,obj);
		return x;
	}

	
	// get listeners
	getListeners() {

		this.loading['listenerList'] = true;
		
		let params = {
            view : 'listeners',
            domid : this.desData.id
        }

		this.elbService.getELBList(params).subscribe(data => {

			if (data && data['status'] == 1) {

				this.listenerList = data;
			} else {
				this.listenerList = null;
			}
			this.loading['listenerList'] = false;

		}, error => {

			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.listenerList = null;
			this.loading['listenerList'] = false;
		});

	}

}
