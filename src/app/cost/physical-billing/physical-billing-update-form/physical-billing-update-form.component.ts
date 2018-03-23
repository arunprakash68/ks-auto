import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataCenterListService } from '../../../_services/data-center-list.service';
import { BillingService } from '../../../_services/billing.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { Router, NavigationEnd } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
	selector: 'physical-billing-update-form',
	styles: [],
	providers: [DataCenterListService, BillingService, ErrorHandlerService],
	templateUrl: './physical-billing-update-form.component.html'
})

export class PhysicalBillingUpdateFormComponent {
	formData: any;
	updateRequest: any;
	@Input() assetData: any;
	@Input() assetFieldMapping: any;
	@Output() reloadServerList: EventEmitter<any> = new EventEmitter<any>();
	datacenters: any;
	dcZones: any;
	assetModels: any;
	assetModelTypes: any;
	submitLoading: boolean = false;
	submitError: boolean = false;
	ignoreParams: any;

	constructor(private errorHandlerService: ErrorHandlerService,
		private dataCenterListService: DataCenterListService,
		private billingService: BillingService,
		private router: Router) {
		this.formData = {};
		this.dcZones = {};
		this.ignoreParams = [
		'capex_type_ID',
		'ASSET_MODEL',
		'opex_type_ID',
		'custom_type',
		'di_type_ID',
		'datacenter',
		'opex_type_ASSET_ID',
		'INSTANCE_NAME',
		'MODEL_TYPE',
		'model_type_ID'
		];
		this.initUpdateRequest();
	}

	initUpdateRequest() {
		this.updateRequest = {
			capex_type: {
				value: {},
				condition: []
			},
			opex_type: [],
			DI_TYPE: {
				value: {},
				condition: []
			},
			model_type: {
				value: {},
				condition: []
			}
		};

	}

	onSubmit() {
		console.log(this.formData);
		this.initUpdateRequest();
		for(let prop in  this.formData) {
			if(this.ignoreParams.indexOf(prop) > -1) {
				continue;
			}
			let custom_prop = '';
			if(this.assetFieldMapping[prop] == 'capex_type') {
				if(prop == 'capex_type_COST') {
					custom_prop = 'COST';
				} else if(prop == 'capex_type_PO') {
					custom_prop = 'PO';
				} else {
					custom_prop = prop;
				}

				this.updateRequest['capex_type']['value'][custom_prop] = this.checkDate(custom_prop, this.formData[prop]); 
			} else if(prop == 'opex_rows') {
				for(let i = 0; i < this.formData[prop].length; i++) {
					let opexRow = {};
					for(let opexProp in this.formData[prop][i]) {
						if(this.ignoreParams.indexOf(opexProp) > -1) {
							continue;
						}
						if(opexProp == 'opex_type_COST') {
							custom_prop = 'COST';
						} else if(opexProp == 'opex_type_PO') {
							custom_prop = 'PO';
						} else {
							custom_prop = opexProp;
						}
						if(!this.updateRequest['opex_type'][i]) {
							this.updateRequest['opex_type'][i] = {};
						}
						if(!this.updateRequest['opex_type'][i]['value']) {
							this.updateRequest['opex_type'][i]['value'] = {};
						}
						this.updateRequest['opex_type'][i]['value'][custom_prop] = this.checkDate(custom_prop, this.formData[prop][i][opexProp]); 	
					}
					if(this.updateRequest['opex_type'] && this.updateRequest['opex_type'].length < (i + 1)) {
						break;
					}
					if(!this.updateRequest['opex_type'][i]['condition']) {
						this.updateRequest['opex_type'][i]['condition'] = [];
					}
					this.updateRequest['opex_type'][i]['condition'].push(
					{
						key: 'ID', 
						value: this.formData[prop][i]['opex_type_ID'] ? this.formData[prop][i]['opex_type_ID'] : ''
					});
					this.updateRequest['opex_type'][i]['condition'].push(
					{
						key: 'ASSET_ID', 
						value: this.formData[prop][i]['opex_type_ASSET_ID'] ? this.formData[prop][i]['opex_type_ASSET_ID'] : this.formData['capex_type_ID']
					});	

				}
				
			} else if(this.assetFieldMapping[prop] == 'di_type') {
				this.updateRequest['DI_TYPE']['value'][prop] = this.formData[prop]; 
			} else if(this.assetFieldMapping[prop] == 'model_type') {
				this.updateRequest['model_type']['value'][prop] = this.formData[prop];
			}
		}

		this.updateRequest['capex_type']['condition'].push(
		{
			key: 'ID', 
			value: this.formData['capex_type_ID']
		});

		this.updateRequest['DI_TYPE']['condition'].push(
		{
			key: 'ID', 
			value: this.formData['di_type_ID']
		});

		this.updateRequest['DI_TYPE']['condition'].push(
		{
			key: 'ASSET_ID', 
			value: this.formData['capex_type_ID']
		});

		this.updateRequest['model_type']['condition'].push(
		{
			key: 'ID', 
			value: this.formData['MODEL']
		});

		this.submitLoading = true;
		this.submitError = false;
		console.log(this.updateRequest);
		this.billingService.updateAssetData(this.updateRequest).subscribe(data => {
			this.submitLoading = false;
			if(data && data['status'] == 1){
				this.reloadServerList.emit(true);
			} else {
				this.submitError = true;
			}
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
			this.submitLoading = false;
			this.submitError = true;
		})
	}


	ngOnChanges() {
		this.submitError = false;
		if(!this.assetData) return;
		this.updateFormData();
		this.fetchServerUpdateInfo();
	}

	fetchServerUpdateInfo() {
		let dcAPIObservable = this.dataCenterListService.getDataCenters();
		let dcZonesAPIObservable = this.billingService.getDCZones();
		let modelsAPIObservable = this.billingService.getAssetModels();
		let modelTypesAPIObservable = this.billingService.getAssetModelTypes();
		forkJoin([dcAPIObservable, dcZonesAPIObservable, modelsAPIObservable, modelTypesAPIObservable]).subscribe(results => {
			if(results[0]){
				this.datacenters = results[0];
				this.formData['LOCATION'] = this.assetData['LOCATION'];
			}
			if(results[1] && results[1]['status'] != 0) {
				for(let i = 0; i < results[1]['result'].length; i++) {
					if(!this.dcZones[results[1]['result'][i]['DC_ID']]){
						this.dcZones[results[1]['result'][i]['DC_ID']] = [];
					}
					this.dcZones[results[1]['result'][i]['DC_ID']].push(
					{
						ID: results[1]['result'][i]['ID'], 
						INSTANCE_NAME: results[1]['result'][i]['INSTANCE_NAME']
					});
				}
				if(this.dcZones[this.formData['LOCATION']].map((val,i) => {
					return val['ID'];
				}).indexOf(this.assetData['DI_ID']) > -1) {
					this.formData['DI_ID'] = this.assetData['DI_ID'];	
				} else {
					this.formData['DI_ID'] = '';
				}
			}
			if(results[2] && results[2]['status'] != 0) {
				this.assetModels = results[2]['result'];
				this.formData['MODEL'] = this.assetData['MODEL'];		
			}
			if(results[3] && results[3]['status'] != 0){
				this.assetModelTypes = results[3]['result'];
				if(this.assetModelTypes.map((val,i) => {
					return val['ID'];
				}).indexOf(this.assetData['ASSET_TYPE_ID']) > -1) {
					this.formData['ASSET_TYPE_ID'] = this.assetData['ASSET_TYPE_ID'];	
				} else {
					this.formData['ASSET_TYPE_ID'] = '';
				}
			}
		}, error => {
			if (!this.errorHandlerService.validateAuthentication(error)) {
				this.router.navigate(['/login']);
			}
		});
	}

	updateFormData() {
		console.log(this.assetData);
		for(let prop in this.assetData) {
			this.formData[prop] = this.assetData[prop]
		}
	}

	checkDate(prop, val) {
		if(!val || val == '') {
			return val;
		}
		if(prop == 'AMC_E' || prop == 'AMC_S' || prop == 'START_DATE' || prop == 'END_DATE') {
			return val.getFullYear() + '-' + this.padZeroes((val.getMonth() + 1), 2) + '-' + this.padZeroes(val.getDate(), 2);
		}
		return val;
	}

	padZeroes(number, length) {

		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}

		return str;

	}

	addOpexRow() {
		if(!this.formData['opex_rows']) {
			this.formData['opex_rows'] = [];
		}
		this.formData['opex_rows'].push({});
	}

}