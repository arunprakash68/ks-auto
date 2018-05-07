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
	selector: 'description',
	styles: [],
	providers: [ELBService, ErrorHandlerService,DataMapService],
	templateUrl: './description.component.html'
})


export class DescriptionComponent {
	@Input() desData :  any;
	loading : any;


	constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private dataMapService : DataMapService) {
			this.loading = {}
	}
	 
	ngOnInit(){
	}

	ngOnChanges(){
	}

	
	// get map
	getMap(value,obj){
		let x = this.dataMapService.getMap(value,obj);
		return x;
	}

	onWafChange(){
		console.log(this.desData)
	}

	onRedirectionChange(){
		console.log(this.desData)
	}

}
