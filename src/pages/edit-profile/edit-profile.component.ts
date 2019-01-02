import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Router } from '@angular/router';
import { Globals } from '../../services/globals.service';

@Component({
	selector: 'edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

	user: any = <any>{};
	email: string = "";
	busy: any;
	cities: any;
	constructor(private repo: Repo,
		private globals: Globals,
		private router: Router) {

		this.user = JSON.parse(localStorage.EFUserData);
		this.email = this.user.email;
		this.repo.getUserData().subscribe(data => {
			if (data.api_token == null)
				this.logout();
			else {
				localStorage.EFUserData = JSON.stringify(data);
				localStorage.api_token = data.api_token;
				this.user = data;
				this.email = this.user.email;
			}
		});
		this.getData();
	}

	ngOnInit() {
	}
	getData() {
		this.repo.getCities().subscribe(data => {
		  this.cities = data;
		});
	  }

	submitUpdates() {
		if (!this.user.first_name) {
			this.globals.errorAlert('ERROR', 'FULLNAME_REQUIRED');
		}
		else if (!this.user.mobile) {
			this.globals.errorAlert('ERROR', 'MOBILE_REQUIRED');
		}
		else if (!this.email) {
			this.globals.errorAlert('ERROR', 'MAIL_REQUIRED');
		}
		else {
			if (this.user.email == this.email)
				this.user.email = this.email;

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
		this.router.navigate(['homepage']);
	}

}
