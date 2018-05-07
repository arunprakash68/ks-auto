import { Component, Input, Output, TemplateRef,OnInit, ViewChild, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
	selector: 'alert-message',
	moduleId: module.id,
	templateUrl: './alert-message.component.html'
})

export class AlertMessage implements OnInit {
	modalRef2: BsModalRef;
	textStrings : any;

	@Output() triggerDelete: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('confirmModalAlert') modalAlert;

	constructor(private modalService: BsModalService) {
		
	}

	ngOnInit(){
	}

	linkactivate(){
		this.triggerDelete.emit(this.textStrings);
	}
    showModal(textStrings) {
		this.textStrings = textStrings;
		this.openAlertModal(this.modalAlert)
	}
	
	hideModal(){
		this.closeAlertModal()
	}
   
	// open modals
	openAlertModal(template: TemplateRef<any>) {
		let config = {
			ignoreBackdropClick: true,
			keyboard: false,
			class: 'custom-modal alert'
		};

	  	this.modalRef2 = this.modalService.show(template, config);
	}

	closeAlertModal() {
		this.modalRef2.hide();
		this.modalRef2 = null;
	}
  }