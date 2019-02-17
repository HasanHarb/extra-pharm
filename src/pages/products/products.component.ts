import { Component, OnChanges, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ActivatedRoute } from '@angular/router';
import { ProductData, PaginateData } from "../../models/models";
import * as _ from 'lodash';

@Component({
	selector: 'app-products',
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],

})
export class ProductsComponent implements OnInit, OnChanges {
	//busy: Promise<any>;
	range = [0, 1000];
	//Search input
	start: number = 1;
	end: number = 12;
	@ViewChild('input') searchInput;
	//seatch key
	search_key: string = "";
	//search result
	results: any = [];
	lastPage: number;
	// category slug
	categorySlug: any;
	// pages
	@Input() paginate: PaginateData = <PaginateData>{};
	pages: any = [];
	// category
	category: any = <any>{};
	// list of products
	products: ProductData[] = [];
	@Input() product: ProductData = <ProductData>{};
	// products' iamges url
	imagesUrlBase: string;
	// selected category to fetch product for
	categoryId: number;
	// pagiantion date
	productPaginate: PaginateData = <PaginateData>{};
	// used to check search query input focus state
	focusState: boolean = false;
	// search query input value
	searchKey: string;
	// used to set expanded area in filters menu
	expandedArea: any;
	pageNumber: number;
	// used in filters menu to enable user filter by company/brand
	groups: any = [];
	companies: any;
	firtTen: any;
	// selected filter initial state
	filteredCompaniesKey: string;
	productSpecialOrder: number;
	selectedFilters: any = {
		brands: 'ALL',
		gender: 'ALL',
		price: 'lowest',
	};
	minPrice: number = 1;
	maxPrice: number = 1000;
	rangeMin: number = 1;
	rangeMax: number = 1000;
	busy: boolean = false;
	sliders = [];
	host = "";
	limitAttrs: number = 15;

	constructor(public repo: Repo, private route: ActivatedRoute) {
		this.host = window.location.host;
	}

	ngOnInit() {
		let paged = this.route.snapshot.queryParams["page"] || 1;
		this.pageNumber = Number(this.route.snapshot.queryParams["page"] || 1);
		this.route.params.subscribe(params => {
			this.categorySlug = params['slug'];
			this.getProducts(paged);
			this.getCategory();
			this.getAttributes();
			this.getSliders();
		});
	}

	showMore(length) {
		this.limitAttrs = this.limitAttrs == 15 ? length : 15
	}

	getSliders() {
		this.repo.getSliders({ place: 'home', media: 'desktop' }).subscribe(data => {
			this.sliders = data.data;
		});
	}

	ngOnChanges(changes: SimpleChanges) {

	}

	rangeChanged(event: any) {
		this.minPrice = this.range[0];
		this.maxPrice = this.range[1];
		this.getProducts();
	}

	getProducts(page: number = 1, scrollTop: boolean = true) {

		if (scrollTop) window.scrollTo(0, 0);

		this.busy = true;
		this.products = [];
		let searchQuery = {
			search_key: this.search_key,
			category_slug: this.categorySlug,
			page: page,
			min_price: this.minPrice,
			max_price: this.maxPrice,
			attrs: {}
		}

		if (this.groups.length) {
			this.groups.forEach(element => {
				searchQuery.attrs[element.slug] = this.selectedFilters[element.slug] == 'ALL' ? this.selectedFilters[element.slug] : this.selectedFilters[element.slug];
			});
		}

		this.repo.getProducts(searchQuery).subscribe((data: any) => {

			setTimeout(() => {
				this.busy = false
			}, 1000);

			this.pageNumber = page;
			/*if(data.data.length < 1){
				this.products = data.data;
			}*/
			if (page == 1) {
				this.pages = [];
			}
			if (this.pages.length < 9) {
				this.pages = new Array(data.last_page);
				this.lastPage = Number(data.last_page);
				if (data.last_page > 9) {
					this.pages.splice(this.start, this.end);
				}
			}
			this.productPaginate = data;
			this.products = data.data;

		}, err => this.busy = false);
	}

	activePageNumber(page) {
		if (this.pageNumber == page) {
			return true;
		}
		else {
			return false;
		}
	}

	searchProducts(clear: boolean = false) {
		let searchQuery = {
			category_slug: this.categorySlug,
			search_Key: this.search_key,
			page: this.paginate.current_page
		};
		if (clear) {
			this.reset();
		}
		this.repo.getProducts(searchQuery).subscribe((data: any) => {
			if (data.data) {
				for (data.current_page; data.current_page <= data.last_page; data.current_page++) {
					data.data.forEach(element => {
						if (this.search_key != "") {
							this.search_key.toLowerCase();
							if (element.title.includes(this.search_key)) {
								this.results.push(element);
							}
						}
					});
				}
			}
		})
	}

	reset() {
		this.results = [];
	}

	close() {
		this.search_key = "";
		//this.reset();
		this.getProducts();
	}
	/**
	 * getAttributes
	 * Fetch attributes from APi to use in filter menu
	 */
	getAttributes() {
		this.repo.getAttributes(this.categorySlug).subscribe((attrs: any) => {
			this.groups = attrs
			attrs.forEach(element => {
				this.selectedFilters[element.slug] = 'ALL';
			});
			// this.companies = attrs.filter(f => f.name == 'Company')[0].attributes;
		});
	}
	addBrands() {
		this.firtTen = this.companies;
	}
	/**
	 * applyFilter
	 * Apply user selected filter and fetch product again upon user selection
	 * @param key
	 * @param value
	 */
	applyFilter(key, value) {
		this.selectedFilters[key] = value;
		this.getProducts();
	}

	getCategory() {
		let searchQuery = {
			slug: this.categorySlug
		};
		this.repo.getCategory(searchQuery).subscribe((data: any) => {
			this.category = data;
		});
	}

	expand(area: any, keep: boolean) {
		if (keep) {
			this.expandedArea = area;
		} else {
			this.expandedArea = this.expandedArea == area ? null : area;
		}
	}

	sort(criteria) {
		if (criteria == 'alpha') {
			this.products = _.orderBy(this.products, [p => p.title], ['asc']);
		} else if (criteria == 'priceAsc') {
			this.products = _.orderBy(this.products, [p => p.regular_price], ['asc']);
		} else if (criteria == 'priceDesc') {
			this.products = _.orderBy(this.products, [p => p.regular_price], ['desc']);
		}
	}

}
