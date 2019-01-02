import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ActivatedRoute } from '@angular/router';
import { ProductData, PaginateData } from "../../models/models";
import { ToastrService } from 'ngx-toastr';
import { Config } from "../../config";
import {Http} from '@angular/http';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
	busy:  boolean;
	featuredSales: any[];
	sales: ProductData[] = [];
	imagesUrlBase = Config.StorageUrl;
	paginate: PaginateData = <PaginateData>{};

	constructor(
		public repo: Repo,
		private http: Http,
		private toastr: ToastrService
	) {
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
