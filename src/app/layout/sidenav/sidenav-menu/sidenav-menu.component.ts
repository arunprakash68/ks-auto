import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CapitalizeFirstPipe } from '../../.././pipes/capitalizefirst.pipe';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'my-app-sidenav-menu',
	styles: [],
	templateUrl: './sidenav-menu.component.html'
})

export class AppSidenavMenuComponent {
	userConfig: any;
	@ViewChild('sidenav') sidenav: ElementRef;

	constructor(private router: Router){
		if(!localStorage.getItem('user')){
			this.router.navigate(['/login']);
		  }
		this.userConfig = JSON.parse(localStorage.getItem('user'));
	}

	ngAfterViewInit() {
		this.explicitlyOpenSidenavTab();
	}

	explicitlyOpenSidenavTab() {
		const activeTab = $(this.sidenav.nativeElement).children('li.active');
		if(activeTab && activeTab.length > 0) {
			activeTab.children('a').trigger('click');
		}
	}
}
