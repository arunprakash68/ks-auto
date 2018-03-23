import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({selector: '[dynAccordion]'})

export class DynamicAccordianDirective implements AfterViewInit {

	el: ElementRef;
	@Input() collapseToggle: string; 

	constructor(el: ElementRef) {
		this.el = el;
	}

	ngAfterViewInit() {

		const $triggerElement = $(this.el.nativeElement);
		const elementIdToToggle = this.collapseToggle;
		const slideTime = 250;
		// $('#' + elementIdToToggle).on('').css('display', 'none');

		$triggerElement.on('click', (e) => {
			$('#' + elementIdToToggle).stop().slideToggle('slow');
		})
	}

}