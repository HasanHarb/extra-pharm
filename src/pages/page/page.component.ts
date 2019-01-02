import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Repo } from '../../services/repo.service';

@Component({
	selector: 'app-page',
	templateUrl: './page.component.html',
	styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
	content: any = {};
	topFourProducts: any = [];
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public repo: Repo
	) { }

	ngOnInit() {
		this.getTopFourProducts();
		this.route.params.subscribe(params => {
			this.repo.getPage(params['slug']).subscribe((page:any) => {
				if (page.id) {
					this.content = page;
				} else {
					this.router.navigate(['/404']);
				}
			});
		});
	}

	getTopFourProducts(){
		this.repo.getTopProducts().subscribe((items:any) => {			
			this.topFourProducts = items;
		});
	}

}
