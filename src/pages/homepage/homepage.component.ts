import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Config } from "../../config";

@Component({
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
	sliders: any;
	centerBanners: any;
	topRatedProducts: any;
	categories: any = [];
	mainCategories: any;
	threeCate: any;
	firstCategory: any = <any>{};
	imagesUrlBase: string;
	mainSliderOptions: any;
	topRatedCarouselOptions: any;
	topTenProducts: any;
	topFourProducts: any = [];
	topCategorizedProducts: any;
	host = "";

	constructor(public repo: Repo) {
		this.host = window.location.host;
		this.mainSliderOptions = {
			rtl: true,
			autoplay: false,
			autoplayHoverPause: true,
			loop: true,
			margin: 0,
			dots: true,
			nav: true,
			navText: [
				"<i class='fa fa-angle-left'></i>",
				"<i class='fa fa-angle-right'></i>"
			],
			responsiveRefreshRate: 100,
			responsive: {
				0: { items: 1 },
				479: { items: 1 },
				768: { items: 1 },
				991: { items: 1 },
				1024: { items: 1 }
			}
		};
		this.topRatedCarouselOptions = {
			rtl: true,
			autoplay: false,
			loop: true,
			margin: 30,
			dots: false,
			nav: true,
			navText: [
				"<i class='fa fa-angle-left'></i>",
				"<i class='fa fa-angle-right'></i>"
			],
			responsive: {
				0: { items: 1 },
				479: { items: 2 },
				768: { items: 3 },
				991: { items: 4 },
				1024: { items: 5 },
				1280: { items: 6 }
			}
		};

		// get data
		this.getSliders();
		this.getCenterBanners();
		this.getTopTen();
		this.getTopFourProducts();
		this.getCategories();
		this.getCategorizedProducts();
	}

	ngOnInit() {
		this.imagesUrlBase = Config.StorageUrl;
	}

	getSliders() {
		this.repo.getSliders({ place: 'home', media: 'desktop' }).subscribe((sliders: any) => {
			this.sliders = sliders.data;
		});
	}

	getCenterBanners() {
		this.repo.getCenterBanners({ position: 2 }).subscribe((banners: any) => {
			this.centerBanners = banners;
		});
	}

	getTopTen() {
		this.repo.getTopTen().subscribe((data: any) => {
			if (data.data) {
				this.topTenProducts = data.data;
			}
		});
	}

	getCategories() {
		this.repo.getHomeCategories().subscribe((data: any) => {
			if (data) {
				this.firstCategory = data[0];
				this.threeCate = data;
			}
		});
	}

	getTopFourProducts() {
		this.repo.getTopProducts().subscribe((items: any) => {
			this.topFourProducts = items;
		});
	}

	getCategorizedProducts() {
		this.repo.getCategoriezedProducts().subscribe((items: any) => {
			this.topCategorizedProducts = items;
		})
	}

}
