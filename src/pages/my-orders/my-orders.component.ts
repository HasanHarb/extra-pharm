import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Router } from '@angular/router';

@Component({
	selector: 'my-orders',
	templateUrl: './my-orders.component.html',
	styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

	user: any = <any>{};
	email: string = "";
	busy: any;
	items = [];
	selectedOrder: any = <any>{};
	page = 1;
	pages = [];
	host = "";

	statusList: any = [
		{ status: 'NEW', icon: 'assets/orders/review', class: 'new' },
		{ status: 'IN_PROCESS', icon: 'assets/orders/process', class: 'in-process' },
		{ status: 'IN_DELIVERY', icon: 'assets/orders/delivery', class: 'in-delivery' },
		{ status: 'DONE', icon: 'assets/orders/deliver', class: 'done' },
		{ status: 'DELIVERED', icon: 'assets/orders/deliver', class: 'done' },
		{ status: 'CANCEL', icon: 'assets/orders/deliver', class: 'done' },
	];

	constructor(private repo: Repo, private router: Router) {
		this.host = window.location.host;
		this.getItems();
	}

	ngOnInit() {
	}

	getStatus(item: any) {
		let status = this.statusList.filter(s => s.status == item.status)[0];
		return status; //.icon + '-done.png';
	}

	getItems(page = 1) {
		this.busy = true;
		let params = {
			api_token: localStorage.api_token,
			page: page
		};

		this.repo.getMyOrders(params).subscribe((data: any) => {
			this.pages = [];
			for (var i = 1; i <= data.last_page; i++) {
				this.pages.push(i);
			}
			this.busy = false;
			this.page = data.current_page;
			data.data.forEach(element => {
				element.created_at = new Date(element.created_at.replace(/\s/g, "T"));
			});
			this.items = data.data;
		}, err => this.busy = false);
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
