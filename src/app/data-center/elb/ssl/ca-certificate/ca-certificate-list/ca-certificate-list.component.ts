import { Component, OnInit } from '@angular/core';
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
  selector: 'app-ca-certificate-list',
  templateUrl: './ca-certificate-list.component.html',
  providers: [ELBService, ErrorHandlerService],
})
export class CaCertificateListComponent implements OnInit {

  loading: Boolean;
  params: any;
  cacertlist: any;
  certCallError: Boolean;
  showNoCertMsg: Boolean;
  totalResult: number;
  constructor(private elbService: ELBService,
		private errorHandlerService: ErrorHandlerService,
		private router: Router) {
    this.loading = true;
    this.params = {
      'zone': 'TIL-MUM-1A',
      'location': 'Mumbai'
    }
    this.showNoCertMsg = false;
    this.certCallError = false;
    this.totalResult= 0;

   }

  ngOnInit() {
    this.getsslcert();
    // console.log('location: ',localStorage.getItem("location"));
  }

  getsslcert(){
    this.elbService.getSSLCertificate(this.params).subscribe(data => {
      this.cacertlist = data.sslcerts.filter(cert => {
        return cert.certificatetype.indexOf('ROOT_CERT') !== -1
      });
      this.cacertlist.filter(function(obj){
        let cn = obj.subject.split(",");
        for(let i=0;i<cn.length;i++ )
        {
          if(cn[i].indexOf('CN=') !== -1)
          {
            let helperone = cn[i].split("CN=");
            var res = helperone[1]
          }
        }
        if(typeof res === undefined || res === '' )
        {
          obj["commonname"]= obj.certkey;
        }
        else{
          obj["commonname"]= res;
        }
        
        
      });
      this.totalResult = this.cacertlist.length;
      this.cacertlist = this.cacertlist.slice(0, 16);
      this.loading = false;
      this.certCallError = false;
      if(this.cacertlist.length === 0){
        this.showNoCertMsg = true;
      }

			
		}, error => {
      this.loading = false;
			this.certCallError = true;
			
		});
  }

}
