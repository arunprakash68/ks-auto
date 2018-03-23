import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BillingService } from '../../../_services/billing.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'infra-billing-list',
	styles: [],
	providers: [BillingService, ErrorHandlerService],
	templateUrl: './infra-billing-list.component.html'
})

export class InfraBillingListComponent {
	@Input() billingParamsIn;
	billingParams: any;
	config: any;
	billings: any;
	billDetails: any[];
	billDetailParams: any[];
	billDetailsError: any[];
	billDetailsLoading: any[];
	finalBillings: any;
	pagination: any;
	loading: boolean;
	billingCallError: boolean;
	dcZones: any;
	
	constructor(private billingService: BillingService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router){
		this.finalBillings = {};
		this.pagination = {
			page: 1,
			pageSize: 16,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0
		};
		this.config = {
			serverType: {
				cloud: 'VM',
				physical: 'PHY',
				storage: 'Storage',
				elb: 'ELB'
			},
			serverTypeClass: {
				vm: 'cloud-server',
				phy: 'physical-server',
				db: 'storage-server',
				elb: 'elb-server'
			} 
		};
		const currentDate = new Date();
		this.billingParams = {
			start: 0,
			limit: 16,
			costtype: 'bu',
			month: currentDate.getUTCMonth() + 1,
			year: currentDate.getUTCFullYear(),
			bu_value: ''
		};
		this.billDetails = [];
		this.billDetailParams = [];
		this.billDetailsLoading = [];
		this.billDetailsError = [];
		this.loading = true;

		this.getBilling();
	}

	ngOnChanges() {
		// if(this.billingParamsIn && this.billings) {
			this.updateBillingParams();
			this.getBilling();
		// }
	}

	updateBillingParams() {
		const currentDate = new Date();
		this.billingParams = {
			start: 0,
			limit: 16,
			costtype: this.billingParamsIn['bu_value'] ? 'project' : 'bu',
			month: this.billingParamsIn['month'] ? this.billingParamsIn['month'] : currentDate.getUTCMonth() + 1,
			year: this.billingParamsIn['year'] ? this.billingParamsIn['year'] : currentDate.getUTCMonth() + 1,
			bu_value: this.billingParamsIn['bu_value'] || '' ,
			project_value: this.billingParamsIn['project_value'] || '',
		};
	}

	checkZeroValue(val) {
		if(val && val > 0) {
			return val;
		}
		return '-';
	}

	getBgClassForServerType(server) {
		try {
			if(server) {
				return this.config.serverTypeClass[server['typeOfServer'].toLowerCase()];
			}
		} catch(e) {

		}
		return '';
	}

	triggerBillDetails(index, currentBill) {
		this.finalBillings.result[index].expandDetails = !this.finalBillings.result[index].expandDetails;
		if(!this.finalBillings['result'][index]['expandDetails']){
			return;
		}
		const dcZone = this.finalBillings.result[index]['zone_list'].length > 0 ? this.finalBillings.result[index]['zone_list'][0]: null;
		this.getBillDetails(index, currentBill.BU, dcZone);
	}

	getCheckedArr(arr, index) {
		if(arr && !arr[index]) {
			arr[index] = {};
		}
		return arr;
	}

	getBillDetails(index, business, dcZone) {
		

		this.getCheckedArr(this.billDetailParams, index)[index][dcZone['DIID']] = {
			start: 0,
			limit: 16,
			costtype: 'project',
			month: this.billingParamsIn['month'],
			year: this.billingParamsIn['year'],
			bu_value: business,
			project_value: '',
			zone: dcZone['DIID']
		};
		this.getCheckedArr(this.billDetailsLoading, index)[index][dcZone['DIID']] = true;
		this.getCheckedArr(this.billDetailsError, index)[index][dcZone['DIID']] = false;
		this.billingService.getBillingDetails(this.billDetailParams[index][dcZone['DIID']]).subscribe(data => {
			this.billDetailsLoading[index][dcZone['DIID']] = false;
			
			if(data && data['status'] == 1) {
				this.getCheckedArr(this.billDetails, index)[index][dcZone['DIID']] = [];
				for(let type in data['result']) {
					for(let i = 0; i < data['result'][type].length; i++){
						data['result'][type][i]['typeOfServer'] = 
						this.config['serverType'][type.toLowerCase()] ? this.config['serverType'][type.toLowerCase()] : '';
						this.billDetails[index][dcZone['DIID']].push(data['result'][type][i]);
					}
				}
				
				// this.updatePaginationParameters();
			} else {
				this.getCheckedArr(this.billDetails, index)[index][dcZone['DIID']] = null;
				this.getCheckedArr(this.billDetailsError, index)[index][dcZone['DIID']] = true;	
			}
			
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.getCheckedArr(this.billDetails, index)[index][dcZone['DIID']] = null;
			this.getCheckedArr(this.billDetailsError, index)[index][dcZone['DIID']] = true;	
			this.getCheckedArr(this.billDetailsLoading, index)[index][dcZone['DIID']] = false;
		});
	}


	getBilling() {
		this.loading = true;
		this.billingCallError = false;
		this.billingService.getBillingDetails(this.billingParams).subscribe(data => {
			this.loading = false;
			
			if(data && data['status'] == 1) {
				this.billings = data;
				if(!this.finalBillings) {
					this.finalBillings = {};
				}
				this.finalBillings['status'] = 1;
				this.finalBillings['totalresult'] = this.billings['totalresult'];
				this.finalBillings['result'] = [];
				for(let i = 0; i < data['result'].length; i++) {
					this.finalBillings['result'][2 * i] = data['result'][i];
					this.finalBillings['result'][2 * i]['expandDetails'] = false;
					this.finalBillings['result'][2 * i]['dynamicRow'] = false;
					this.finalBillings['result'][(2 * i) + 1] = {expandDetails: false, dynamicRow: true };
					this.finalBillings['result'][(2 * i) + 1]['zone_list'] = JSON.parse(data['result'][i]['zone_list']);
					for(let j = 0; j < this.finalBillings['result'][(2 * i) + 1]['zone_list'].length; j++) {
						this.getCheckedArr(this.billDetailsLoading, (2 * i) + 1)[(2 * i) + 1][this.finalBillings['result'][(2 * i) + 1]['zone_list'][j]['DIID']] = true;
						this.getCheckedArr(this.billDetailsError, (2 * i) + 1)[(2 * i) + 1][this.finalBillings['result'][(2 * i) + 1]['zone_list'][j]['DIID']] = false;
					}
				}
				this.updatePaginationParameters();
			} else {
				this.billings = null;
				this.finalBillings = null;
				this.billingCallError = true;	
			}
			
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.billings = null;
			this.finalBillings = null;
			this.loading = false;
			this.billingCallError = true;
		});
		
	}

	
	getBUDetails(currentBill) {
		let details = [];
		if(currentBill['vmcount']) {
			details.push(currentBill['vmcount'] + ' Virtual Machines');
		}
		if(currentBill['physicalcount']) {
			details.push(currentBill['physicalcount'] + ' Physical Servers');
		}
		if(currentBill['storagecount']) {
			details.push(currentBill['storagecount'] + ' Storage Servers');
		}
		if(currentBill['elbcount']) {
			details.push(currentBill['elbcount'] + ' ELBs');
		}
		if(details.length > 0) {
			return details.join(', ');
		}
		return '';
	}

	updatePaginationParameters() {
		this.pagination.collectionSize = this.billings['totalresult'];
		this.pagination.pageItemIndex = (this.pagination.page - 1) * this.pagination.pageSize;
	}

	pageChange(currPage){
		this.pagination.page = currPage;
		this.billingParams['start'] = (currPage - 1) * this.pagination.pageSize;
		this.billingParams['limit'] = this.pagination.pageSize;
		this.getBilling();
	}

	showPagination() {
		if (this.loading) {
			return false;
		}
		if(this.billingCallError) {
			return false;	
		}
		if(this.showNoBillingMsg()) {
			return false;
		}
		return true;
	}

	showNoBillingMsg() {
		return (this.billings && !(this.billings.status == 1)) || (this.billings && (this.billings.result.length == 0));
	}

	showNoBillDetailsMsg(index, dcZone) {
		let billDetail = null;
		if(this.billDetails[index] && this.billDetails[index][dcZone['DIID']]) {
			billDetail = this.billDetails[index][dcZone['DIID']];
		}
		if(billDetail && billDetail['result'] && billDetail['result'] < 1) {
			return true;
		}
		return false;
	}

	getFLoat(str) {
		return parseFloat(str);
	}

}
