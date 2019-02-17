import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
	busy: boolean;
	results: any[] = [];
	searchQuery: any;
	search_key: any;
	constructor(private repo: Repo, private route: ActivatedRoute) {

	}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.search_key = params['q'];
			this.searchProducts();
		});
	}

	searchProducts() {
		this.busy = true;
		let searchQuery = {
			search_key: this.search_key,
			page: 1,
		};
		this.repo.getProducts(searchQuery).subscribe((data: any) => {
			this.busy = false;
			if (data.data) {
				data.data.forEach(element => {
					this.results.push(element);
				});
			}
		});
	}

}
