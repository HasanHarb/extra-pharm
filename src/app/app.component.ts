import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Repo } from '../services/repo.service';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Globals } from '../services/globals.service';
import { Cart } from '../services/cart.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
	lang: any = localStorage.selectedLang || 'ar';
	languages: any;
	searchKey: string = "";
	threeCate: any ;
	menuStatus: boolean = false;
	content: any;
	selectedLanguageName: any;
	mainCategories: any;
	loggedIn: boolean = false;
	user: any = <any>{};

	newsletterEmail = "";
	subscribeForm: FormGroup;	
	subscribeError = false;
	subscribeErrorText = "";

	busy: any;
	settings : any;

	constructor(
		public repo: Repo,
		private router: Router,
		public translate: TranslateService,
		private globals: Globals,
		private formBuilder: FormBuilder,
		public cart: Cart) {

		this.subscribeForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]]
		});

		this.repo.getSettings().subscribe(data => {
			this.settings = data;
		});

		this.repo.getAbout().subscribe((page:any) => {
				this.content = page;
		});
		router.events.subscribe((val) => {
			if(val instanceof NavigationEnd){
				if(!val.urlAfterRedirects.includes('search')){
					this.searchKey = null;
				}
			}
		});

		this.loggedIn = repo.isLoggedIn();
		if(this.loggedIn) {
			this.repo.getUserData().subscribe(data => {
				if (data.api_token == null)
					this.logout();
				else {
					localStorage.EFUserData = JSON.stringify(data);
					localStorage.api_token = data.api_token;
					this.user = data;
				}			
			});
		}
		//this.translate.setDefaultLang('ar');
		this.translate.setDefaultLang(this.lang);
		this.repo.getLanguages().subscribe((langs: any) => {
			this.selectedLanguageName = langs.filter(l => l.locale == this.lang)[0].name;
			this.languages = langs;
		});

		this.getCategories();

		this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
	}

	postSubscriber()
	{
		this.subscribeError = false;
		this.subscribeErrorText = "";

		if (this.subscribeForm.controls['email'].invalid) {
			this.subscribeErrorText = 'CONTACT_EMAIL_REQUIRED';
			this.subscribeError = true;
		}
		else
		{
			this.busy = this.repo.postSubscriber({email: this.newsletterEmail}).subscribe(data => {
				if (data.id != null) {
					this.newsletterEmail = "";
					this.subscribeForm.reset();
					this.globals.successAlert('DONE', 'SUCCEED');
					this.router.navigate(['/subscribing-thanks']);
				}
			});
		}
	}

	selectLang(lang) {
		this.lang = lang;
		this.translate.setDefaultLang(this.lang.locale);
		localStorage.selectedLang = this.lang.locale;
		this.selectedLanguageName = this.lang.name;

	}

	refreshLoggedIn()
	{
		this.loggedIn = this.repo.isLoggedIn();
		if(this.loggedIn)
			this.user = JSON.parse(localStorage.EFUserData);
		return this.loggedIn;
	}

	getCategories() {
		this.repo.getCategories().subscribe((cats: any) => {
			this.mainCategories = cats.data;
			this.threeCate = cats.data.slice(0, 3);
		});
	}

	logout() {
		localStorage.api_token = null;
		localStorage.removeItem('api_token');
		localStorage.EFUserData = null;
		localStorage.removeItem('EFUserData');
		this.user = <any>{};
		this.loggedIn = this.repo.isLoggedIn();
		this.router.navigate(['']);
	}

	submitSearch(){
		this.router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		  };
		this.router.navigate(['/search'], { queryParams: { q: this.searchKey } });
	}

    getCartLength(){
		return this.cart.getCart().length;
    }



}
