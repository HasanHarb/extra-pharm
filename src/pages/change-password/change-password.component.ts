import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Router } from '@angular/router';
import { Globals } from '../../services/globals.service';

@Component({
	selector: 'change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

	user: any = <any>{};
	email: string = "";
	busy: any;

	constructor(private repo: Repo,
		private globals: Globals,
		private router: Router) {

		this.user = JSON.parse(localStorage.EFUserData);
		this.user.password = "";
		this.repo.getUserData().subscribe(data => {
			if (data.api_token == null)
				this.logout();
			else {
				localStorage.EFUserData = JSON.stringify(data);
				localStorage.api_token = data.api_token;
				this.user = data;
				//this.user.email = "";
				this.user.password = "";
			}
		});
	}

	ngOnInit() {
	}

	submitUpdates() {
		if (!this.user.password)
		{
			this.globals.errorAlert('ERROR', 'PASSWORD_REQUIRED');
		}
		if (this.user.password != this.user.password2) {
			this.globals.errorAlert('ERROR', 'PASSWORD_NOT_MATCH');
		} 
		else {
			this.busy = this.repo.updateMyProfile(this.user).subscribe(data => {
				if (data == null) {
					this.globals.errorAlert('ERROR', 'REG_ERROR');
				}
				else {
					this.globals.successAlert('DONE', 'UPDATE_SUCCEED');
					this.user = data;
					localStorage.api_token = this.user.api_token;
					localStorage.EFUserData = JSON.stringify(data);
					this.router.navigate(['profile']);
				}
			});
		}

	}

	logout() {
		localStorage.api_token = null;
		localStorage.removeItem('api_token');
		localStorage.EFUserData = null;
		localStorage.removeItem('EFUserData');
		this.user = <any>{};
		this.router.navigate(['login']);
	}

}
