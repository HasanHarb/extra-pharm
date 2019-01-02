import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';

@Component({
  selector: 'promotion-boxes',
  templateUrl: './promotion-boxes.component.html',
  styleUrls: ['./promotion-boxes.component.css']
})
export class PromotionBoxesComponent implements OnInit {
  
	bottomBanners: any;

  constructor(public repo: Repo) {
		this.repo.getCenterBanners({ position: 3 }).subscribe((banners: any) => {
			this.bottomBanners = banners;
		});
   }

  ngOnInit() {
  }

}
