import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { USER_CONFIG } from '../../user-config';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'my-page-login',
  styles: [],
  providers: [AuthenticationService],
  templateUrl: './login.component.html'
})

export class PageLoginComponent {
	model: any = {};
	userConfig: any;
	loading: boolean = false;
	loadingError: boolean = false;
	loginFailed: boolean = false;
	returnUrl: string;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService){
		this.userConfig = USER_CONFIG;
	}

	ngOnInit(){
		this.authenticationService.logout();

		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	login() {
		this.loadingError = false;
		this.loading = true;
		this.loginFailed = false;
		this.authenticationService.login(this.model.email, this.model.password)
			.subscribe(
				data => {
					if(data && data['status'] == 1 && data['result']) {
						// this.userConfig = data['result'];
						localStorage.setItem('user', JSON.stringify(data['result']));
						console.log(localStorage.getItem('user'));
						this.router.navigate([this.returnUrl + '/app/data-center/server']);
					} else {
						this.loginFailed = true;
					}
					this.loading = false;
				},
				error => {
					this.loadingError = true;
					this.loading = false;

				});
	}

}
