import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-thanks',
	templateUrl: './thanks.component.html',
	styleUrls: ['./thanks.component.css']
})
export class ThanksComponent implements OnInit {

	host = "";
	orderId = "";

	constructor(private route: ActivatedRoute) {
		this.host = window.location.host;
		this.route.queryParams.subscribe(params => {
			this.orderId = params['orderId'] || '';
		});
	}

	ngOnInit() {
	}

}
