import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { ELBService } from '../../../../_services/data-center/elb.service';
import { DataMapService} from '../../../../_services/data-map.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';


@Component({
  selector: 'volume-description',
  templateUrl: './volume-description.component.html',
  providers: [ELBService, ErrorHandlerService,DataMapService],
})
export class VolumedescriptionComponent implements OnInit {
  @Input() desData :  any;
  loading : any;
  
  constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router,
		private dataMapService : DataMapService) { 
      this.loading = {}
    }

    ngOnInit(){
      // console.log(this.desData)
    }
  
    ngOnChanges(){
      // console.log(this.desData)
    }
  
    
    // get map
    getMap(value,obj){
      let x = this.dataMapService.getMap(value,obj);
      return x;
    }

}
