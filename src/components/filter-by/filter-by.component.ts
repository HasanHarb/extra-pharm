import { Component, OnInit, Input } from '@angular/core';
import { Favorites } from '../../services/favorites.service';
import { Cart } from '../../services/cart.service';
import { Repo } from '../../services/repo.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Http } from '@angular/http';
import { Globals } from '../../services/globals.service';


@Component({
	selector: 'filter-by',
	templateUrl: './filter-by.component.html',
	styleUrls: ['./filter-by.component.css']
})
export class FilterByComponent implements OnInit {

	@Input() categorySlug: number;

	groups: any;

	constructor(private repo: Repo) {
	}

	ngOnInit() {
		this.repo.getAttributes(this.categorySlug).subscribe((attrs: any) => {
			this.groups = attrs;
		});
	}
}
