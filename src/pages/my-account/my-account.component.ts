import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  user: any = <any>{};
  constructor(private repo: Repo, 
    private router: Router) { 

		this.user = JSON.parse(localStorage.EFUserData);
    this.repo.getUserData().subscribe(data => {
			if (data.api_token == null)
				this.logout();
			else {
				localStorage.EFUserData = JSON.stringify(data);
				localStorage.api_token = data.api_token;
				this.user = data;
			}
		});
  }

  ngOnInit() {
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
