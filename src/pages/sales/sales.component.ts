import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ProductData, PaginateData } from "../../models/models";
import { Config } from "../../config";

@Component({
	selector: 'app-sales',
	templateUrl: './sales.component.html',
	styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
	busy: boolean;
	featuredSales: any[];
	sales: ProductData[] = [];
	imagesUrlBase = Config.StorageUrl;
	paginate: PaginateData = <PaginateData>{};

	constructor(public repo: Repo) {
		this.paginate.current_page = 0;
	}

	ngOnInit() {
		this.getProducts();
	}

	getProducts() {
		this.busy = true;
		this.repo.getProducts({ sales: 1 }).subscribe((data: any) => {
			this.busy = false;
			this.paginate = data;
			if (data.data) {
				data.data.forEach(element => {
					this.sales.push(element);
				});
			}
		}, err => this.busy = false);
	}

	doInfinite(infiniteScroll) {
		setTimeout(() => {
			if (this.paginate.current_page < this.paginate.last_page) {
				this.getProducts();
			}
			infiniteScroll.complete();
		}, 500);
	}

}
