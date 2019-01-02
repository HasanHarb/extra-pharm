import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ActivatedRoute } from '@angular/router';
import { ProductData, PaginateData } from "../../models/models";
import { ToastrService } from 'ngx-toastr';
import { Config } from "../../config";
import {Http} from '@angular/http';

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
	constructor(
		private repo: Repo,
		private route: ActivatedRoute,
		private http: Http
	) { 

	}

	ngOnInit() {
		console.log("search");
		
		this.route.queryParams.subscribe(params => {
			console.log(params['q']);
			this.search_key = params['q'];
			this.searchProducts();
		});
		let searchQuery = {			
			search_key: this.search_key,
		};		
  	}
	  
	searchProducts(clear: boolean = false){
		this.busy = true;
		let searchQuery = {			
			search_key: this.search_key,
			page: 1,
		};
		this.repo.getProducts(searchQuery).subscribe((data: any) => {
			this.busy = false;
			if (data.data){
				data.data.forEach(element => {
					this.results.push(element);
				});
			} 			
		});
	}

}