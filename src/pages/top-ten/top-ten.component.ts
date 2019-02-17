import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ProductData } from "../../models/models";
import { ToastrService } from 'ngx-toastr';
import { Config } from "../../config";
import { Http } from '@angular/http';


@Component({
	selector: 'app-top-ten',
	templateUrl: './top-ten.component.html',
	styleUrls: ['./top-ten.component.css']
})
export class TopTenComponent implements OnInit {
	products: ProductData[] = [];
	imagesUrlBase = Config.StorageUrl;
	busy = false;

	constructor(public repo: Repo) { }

	ngOnInit() {
		this.busy = true;
		this.repo.getTopTen().subscribe((data: any) => {
			this.busy = false;
			if (data.data) {
				data.data.forEach(element => {
					this.products.push(element);
				});
			}
		}, err => this.busy = false);
	}
}


