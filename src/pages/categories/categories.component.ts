import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { CategoryData, PaginateData } from "../../models/models";
import { Config } from "../../config";


@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

	categories: CategoryData[] = [];
	firstCategory: CategoryData = <CategoryData>{};
	imagesUrlBase: string;
	paginate: PaginateData = <PaginateData>{};
	host = "";

	constructor(private repo: Repo) {
		this.host = window.location.host;
	}

	ngOnInit() {

		this.imagesUrlBase = Config.StorageUrl;
		this.getCategories();
	}

	getCategories() {
		this.repo.getCategories({ page: this.paginate.current_page + 1 }).subscribe((data: any) => {
			if (data.data) {
				this.firstCategory = data.data[0];
				data.data.forEach(element => {
					this.categories.push(element);
				});
			}
		});
	}
}
