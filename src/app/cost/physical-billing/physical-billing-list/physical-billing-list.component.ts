import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BillingService } from '../../../_services/billing.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { PhysicalBillingUpdateFormComponent } from '../physical-billing-update-form/physical-billing-update-form.component';

@Component({
	selector: 'physical-billing-list',
	styles: [],
	providers: [BillingService, ErrorHandlerService],
	templateUrl: './physical-billing-list.component.html'
})

export class PhysicalBillingListComponent {
	@Input() billingParamsIn;
	// @Output() assetToEditOut: EventEmitter<any> = new EventEmitter<any>();
	billingParams: any;
	billings: any;
	finalBillings: any;
	pagination: any;
	loading: boolean;
	billingCallError: boolean;
	dcZones: any;
	assetToEdit: any;
	assetFieldMapping: any;
	
	constructor(private billingService: BillingService, 
		private errorHandlerService: ErrorHandlerService,
		private router: Router){
		this.pagination = {
			page: 1,
			pageSize: 16,
			maxSize: 5,
			rotate: true,
			boundaryLinks: true,
			pageItemIndex: 0,
			collectionSize: 0
		};
		
		const currentDate = new Date();
		this.billingParams = {
			start: 0,
			limit: 16
		};
		
		this.loading = true;
		this.finalBillings = {};
		this.assetFieldMapping = {};
		// this.getBilling();
	}

	expandAssetDetails(index) {
		this.finalBillings['result'][index] = true;
	}

	ngOnChanges() {
		// if(this.billingParamsIn && this.billings) {
			this.updateBillingParams();
			this.pageChange(1);
			// this.getBilling();
		// }
	}

	updateBillingParams() {
		const currentDate = new Date();
		this.billingParams = {
			start: 0,
			limit: 16,
			dc: this.billingParamsIn['dc'],
			zone: this.billingParamsIn['zone'],
			di_type: this.billingParamsIn['di_type'],
			model:  this.billingParamsIn['model'],
			model_type: this.billingParamsIn['model_type'],
		};
		console.log(this.billingParamsIn);
	}

	checkZeroValue(val) {
		if(val && val > 0) {
			return val;
		}
		return '-';
	}

	
	getCheckedArr(arr, index) {
		if(arr && !arr[index]) {
			arr[index] = {};
		}
		return arr;
	}

	
	combineDataRows(splitRows) {
		let finalRow = {};
		for(let i = 0; i < splitRows.length; i++) {
			if(!splitRows[i]['custom_type']){
				for(let j = 0; j < splitRows[i].length; j++) {
					if(!finalRow['opex_rows']) {
						finalRow['opex_rows'] = [];
					}
					let temp_opex_row = {};
					for(let prop in splitRows[i][j]) {
						if(prop == 'ID' || prop == 'ASSET_ID' || prop == 'COST' || prop == 'PO') {
							temp_opex_row['opex_type_' + prop] = this.checkDate(prop, splitRows[i][j][prop]);
							this.assetFieldMapping['opex_type_' + prop] = 'opex_type';
						} else {
							temp_opex_row[prop] = this.checkDate(prop, splitRows[i][j][prop]);
							this.assetFieldMapping[prop] = 'opex_type';
						}	
					}
					finalRow['opex_rows'].push(temp_opex_row);
				}
				if(!finalRow['opex_rows'] || (finalRow['opex_rows'] && finalRow['opex_rows'].length == 0)) {
					if(!finalRow['opex_rows']) {
						finalRow['opex_rows'] = [];	
					}
					// finalRow['opex_rows'].push({
					// 	START_DATE: '',
					// 	END_DATE: '',
					// 	opex_type_PO: '',
					// 	opex_type_COST: ''
					// });	
					finalRow['opex_rows'].push({});	
				}
			} else {
				

				for(let prop in splitRows[i]) {
					if(prop == 'ID' || prop == 'ASSET_ID' || prop == 'COST' || prop == 'PO') {
						finalRow[splitRows[i]['custom_type'] + '_' + prop] = this.checkDate(prop, splitRows[i][prop]);
						this.assetFieldMapping[splitRows[i]['custom_type'] + '_' + prop] = splitRows[i]['custom_type'];
					} else {
						finalRow[prop] = this.checkDate(prop, splitRows[i][prop]);
						this.assetFieldMapping[prop] = splitRows[i]['custom_type'];
					}
				}
			}
		}
		return finalRow;
	}

	checkDate(prop, val) {
		if(!val || val == '') {
			return val;
		}
		if(prop == 'AMC_E' || prop == 'AMC_S' || prop == 'START_DATE' || prop == 'END_DATE') {
			let d = null;
			d = new Date(val);
			if(!this.isValidDate(d)) {
				d = new Date();
			}
			return d;
		}
		return val;
	}

	isValidDate(d) {
		if ( Object.prototype.toString.call(d) === "[object Date]" ) {
			if ( isNaN( d.getTime() ) ) {
				return false;
			}
			else {
			}
		}
		else {
			return false;
		}
		return true;
	}

	getBilling() {
		this.loading = true;
		this.billingCallError = false;
		this.billings = null;
		this.finalBillings = null;
		this.billingService.getAssetBillingDetails(this.billingParams).subscribe(data => {
			this.loading = false;
			if(data && data['status'] == 1) {
				this.billings = data;
				if(!this.billings['result'] || !this.billings['result']['capex_type']) {
					this.billings = null;
					this.finalBillings = null;
					this.billingCallError = true;	
				}
				for(let i = 0; i < this.billings['result']['capex_type'].length; i++) {
					if(!this.billings['customResult']) {
						this.billings['customResult'] = []; 
					}
					this.billings['result']['capex_type'][i]['custom_type'] = 'capex_type';
					this.billings['result']['di_type'][i]['custom_type'] = 'di_type';
					this.billings['result']['model_type'][i]['custom_type'] = 'model_type';
					// this.billings['result']['opex_type'][i]['custom_type'] = 'opex_type';
					this.billings['customResult'][i] = this.combineDataRows([this.billings['result']['capex_type'][i],
						this.billings['result']['di_type'][i], 
						this.billings['result']['opex_type'][i],
						this.billings['result']['model_type'][i]]);
				}
				if(!this.finalBillings) {
					this.finalBillings = {};
				}
				this.finalBillings['status'] = this.billings['status'];
				this.finalBillings['totalresult'] = this.billings['totalresult'];
				if(!this.billings['customResult']) {
					this.billings = null;
					this.finalBillings = null;
					this.billingCallError = false;	
					return;
				}
				for(let i = 0; i < this.billings['customResult'].length; i++) {
					if(!this.finalBillings['result']) {
						this.finalBillings['result'] = [];
					}
					this.finalBillings['result'][2 * i] = this.billings['customResult'][i];
					this.finalBillings['result'][2 * i]['dynRow'] = false;
					this.finalBillings['result'][(2 * i) + 1] = {dynRow: true, expandDetails: false};
				}
				console.log(this.finalBillings);
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

	editAssetData(assetUpdateModal, assetData) {
		this.assetToEdit = assetData;
		assetUpdateModal.show();
	}

	reloadAssetList(assetUpdateModal) {
		assetUpdateModal.hide();
		this.getBilling();
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
		return !this.billings && !this.billingCallError && !this.loading;
		// return (this.billings && !(this.billings.status == 1)) || (this.billings && (this.billings.result.length == 0));
	}

	showNoBillDetailsMsg(index, dcZone) {
		return false;
	}

	getFLoat(str) {
		return parseFloat(str);
	}

}
