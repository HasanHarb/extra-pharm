import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { ActivatedRoute } from '@angular/router';
import { ProductData, PaginateData } from "../../models/models";
import { ToastrService } from 'ngx-toastr';
import { Config } from "../../config";
import {Http} from '@angular/http';


@Component({
  selector: 'app-top-ten',
  templateUrl: './top-ten.component.html',
  styleUrls: ['./top-ten.component.css']
})
export class TopTenComponent implements OnInit {
	products: ProductData[] = [];
	imagesUrlBase = Config.StorageUrl;
	busy = false;    

  constructor(
	  	public repo: Repo,
		private http: Http,
		private toastr: ToastrService ) { }

  ngOnInit() {
		this.busy = true;
	 this.repo.getTopTen().subscribe((data: any) => {
		 			this.busy = false;
            if (data.data){
							data.data.forEach(element => {
							this.products.push(element);
						});
					}
        },err => this.busy = false);
    }
  }


