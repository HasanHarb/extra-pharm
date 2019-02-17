import { Component, OnInit, Input } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ActivatedRoute } from '@angular/router';
import { Config } from '../../config';


@Component({
	selector: 'order',
	templateUrl: './order.component.html',
	styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

	item: any = <any>{};
	busy = false;

	baseStorageURL = Config.StorageUrl;
	statusList: any = [
		{ status: 'NEW', icon: 'assets/orders/review', class: 'new' },
		{ status: 'IN_PROCESS', icon: 'assets/orders/process', class: 'in-process' },
		{ status: 'IN_DELIVERY', icon: 'assets/orders/delivery', class: 'in-delivery' },
		{ status: 'DONE', icon: 'assets/orders/deliver', class: 'done' },
		{ status: 'DELIVERED', icon: 'assets/orders/deliver', class: 'done' },
		{ status: 'CANCEL', icon: 'assets/orders/deliver', class: 'done' },
	];

	constructor(private repo: Repo, private route: ActivatedRoute) {
		this.route.params.subscribe(params => {
			this.item.id = params['id'],
				this.busy = true;
			this.repo.getOrderInfo(this.item.id).subscribe(data => {
				this.item = data;
				this.busy = false;
			}, err => {
				this.busy = false;
			});
		});
	}

	ngOnInit() {
	}

	getStatus(item: any) {
		let status = this.statusList.filter(s => s.status == item.status)[0];
		//return status; //.icon + '-done.png';
	}


}
