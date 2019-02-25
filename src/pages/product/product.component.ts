import { Component, OnInit, Input } from '@angular/core';
import { CartItemData, ProductTypeData, ProductData } from '../../models/models';
import { Location } from "@angular/common";
import { Favorites } from '../../services/favorites.service';
import { Cart } from '../../services/cart.service';
import { Config } from "../../config";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Repo } from '../../services/repo.service';
import { TranslateService } from '@ngx-translate/core';
import { Globals } from '../../services/globals.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
	pintTemp = "<img src='../assets/img/pinterest.svg'>";
	busy: any;
	// category slug
	categorySlug: any;
	// product data
	products: ProductData[] = [];
	@Input() _product: ProductData = <ProductData>{};
	product: any = <any>{};
	productId: any;
	productImage: string;
	// selected type
	@Input() isFav: boolean;
	selectedType: ProductTypeData = <ProductTypeData>{};
	// cart item object
	cartItem: CartItemData = <CartItemData>{};
	// product attributes
	attrs: any;
	attrsArray: any = [];
	// product colors
	colors: any;
	productColor: any;
	// statis assets url
	imagesUrlBase = Config.StorageUrl;
	// product types
	types: any = [];
	// product original price
	price: number = 0;
	// product price after sale
	priceAfterSale: number = 0;
	priceAsString: string[];
  	showBrandInTitle: boolean = false;
  	brand: string;
	// attrs indicator
	showAttrs: boolean = false;
	// busy indicator
	quantity = 1;
	topRatedCarouselOptions: any;
	specialClicked: boolean = false;
	specialNotes: string = "";
	selectedTypeId = 0;
	productBusy: boolean = false;
	color = '';
	bodyLength: number = 300;
	host = "";
  	truncating = true;
	constructor(
		private fav: Favorites,
		private cart: Cart,
		private repo: Repo,
		private translate: TranslateService,
		private route: ActivatedRoute,
		private location: Location,
		private toastr: ToastrService,
		private globals: Globals,
		private router: Router,
	) {
		this.host = window.location.host;
		/*
		this.route.params.subscribe(params => {
			if (this.productId && this.productId != params['id'])
				window.location.reload();

		});*/
		// // get product id
		// let params = this.navParams.get('params');
		// let id = params? params.id : navParams.get('id');

		// set busy to true
		// get product full details form API

	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.productId = params['id'],
				this.categorySlug = params['slug']
		});
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
		this.getProduct();

	}

	addedFav() {
		if (this.inFav() == true) {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("SUCCEDD_ADDED_FAV"));
		} else {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("SUCCEDD_REMOVED_FAV"));
		}

	}


	addedCart() {
		if (this.inCart(this.product) == true) {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("IN_CART"));
		}
		else {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("OUT_CART"));
		}
	}
	changeQuantity(char) {
		switch (char) {
			case '+':
				this.quantity = this.quantity + 1;
				break;
			case '-':
				if (this.quantity > 1)
					this.quantity = this.quantity - 1;
				break;
		}
	}
	getProducts() {

		let searchQuery = {
			category_id: this.product.category_id
		};
		this.repo.getProducts(searchQuery).subscribe((data: any) => {
			this.products = data.data.slice(0, 9);
		});

	}
	getProduct() {
		this.productBusy = true;

		this.repo.getProduct(this.productId).subscribe((data: any) => {
			this.productBusy = false;

			this.product = data.product;
			this.brand = data.attrs['الماركة'] ? data.attrs['الماركة'].name : null;
			// set image
			this.product.image = this.imagesUrlBase + this.product.image;
			this.productImage = this.product.image;
			// get product attributes
			this.attrs = data.attrs;

			for (var key in this.attrs) {
				if (this.attrs[key].listable) {
					this.attrs[key].group = key;
					this.attrsArray.push(this.attrs[key]);
				}
			}
			// get product colors
			this.colors = data.colors;
			this.colors.forEach(color => {
				color.image = this.imagesUrlBase + color.image;
			});
			// get product types
			this.types = this.product.product_types;
			// set selected product type
			if (this.product.product_types) {
				this.selectedType = this.product.product_types == [] ? null : this.product.product_types.find(x => x.is_default == 1) || this.product.product_types[0];
				this.selectedTypeId = this.selectedType ? this.selectedType.id : 0;
			}
			// attrs ready to show

			this.resolvePrices();
			// resolve title
			this.resolveTitle();
			this.getCategorySlug();
			this.getProducts();

		}, err => this.productBusy = false);
	}
	goBack() {
		this.location.back();
	}

	getCategorySlug() {
		let searchQuery = {
			id: this.product.category_id
		};
		this.repo.getCategory(searchQuery).subscribe((data: any) => {
			this.categorySlug = data.slug;
		});
	}
	/**
	 * resolveTitle
	 */
	resolveTitle() {
		if (this.product.category_id == 7 && JSON.stringify(this.attrs) !== '[]' && this.attrs.hasOwnProperty('Company') && this.attrs.Company.name != '') {
			this.showBrandInTitle = true;
		}
	}
	/**
	 * resolvePrices
	 * Responsible for resolving product prices depening on several criteria
	 */
	resolvePrices() {
		/*let type = null;
		if (this.product.product_types) {
			type = this.product.product_types.find(x => x.is_default == 1) || this.product.product_types[0];
		}*/
		let type = this.selectedType;
		this.price = type != null && type.price > 0 ? type.price : this.product.regular_price;
		this.priceAfterSale = type != null ? type.sale_price > 0 ? type.sale_price : this.price : parseFloat((this.price - (this.price * this.product.sale / 100)).toFixed(2));
		this.priceAsString = this.priceAfterSale.toString().split('.');

	}

	/**
	 * addToCart
	 * @param product
	 */
	inCart(product) {
		if (product) {
			return this.cart.inCart(product);
		}
	}

	addToCart() {
		this.product.attributes = this.attrs;
		this.cartItem.id = this.product.id;
		this.cartItem.product = this.product;
		this.cartItem.quantity = this.quantity;
		this.cartItem.color = this.color;
		this.cartItem.type = this.selectedType;
		this.cart.addToCart(this.cartItem);
		this.addedCart();
	}

	removeProductFromCart() {
		this.cart.removeProductFromCart(this.product);
		this.globals.successAlert("DONE", "REMOVED");
	}

	specialBtnClicked() {
		if (!this.repo.isLoggedIn())
			this.router.navigate(['/login'], { queryParams: { source: '_product_' + this.productId } });
		else
			this.specialClicked = true;
	}
	/**
	 * specialOrder
	 * Order products that not in inventory
	 */
	specialOrder() {

		var products = [];
		products.push({
			id: this.product.id,
			product: this.product,
			quantity: 1,
			type: this.selectedType
		});
		var orderItems = {
			products: products,
			notes: this.specialNotes,
			is_special: "YES"
		}

		this.busy = this.repo.placeOrder(orderItems).subscribe(data => {
			this.router.navigate(['my-orders/' + data.id]);
		});
	}

	truncateHTML(text: string): string {

		let charlimit = 200;
		if(!text || text.length <= charlimit )
		{
			return text;
		}


	  let without_html = text.replace(/<(?:.|\n)*?>/gm, '');
	  let shortened = without_html.substring(0, charlimit) + "...";
	  return shortened;
	}

	/*sepecialAlert() {
		if (!this.repo.isLoggedIn()) {
			// this.globals.loginRegisterAlert(this.navCtrl, ProductPage, {id: this.product.id, type: this.selectedType});
		} else {

			// let prompt = this.alertCtrl.create({
			// 	title: this.translatefn('SPECIAL_ORDER_TEXT'),
			// 	subTitle: "<h4>" + this.product.title + "</h2>",
			// 	message: "<div>" +
			// 		(this.product.sale > 0 ? ("<div class='how-much-sale'>" +
			// 			"<span class='the-text-sale'>" + this.product.sale + "%" + this.translatefn('SALE') + "</span>" +
			// 			"</div>") : "") +
			// 		"<div class='prices overall'>" +
			// 		(this.product.sale > 0 ? ("<span class='old-price'>" + this.price + " ₪</span>") : "") +
			// 		"<span class='new-price'>" + this.priceAfterSale + " ₪</span>" +
			// 		"</div>" +
			// 		"</div>",
			// 	cssClass: 'custom-alert gender-types lang-' + localStorage.selectedLang,
			// 	inputs: [
			// 		{
			// 			name: 'notes',
			// 			placeholder: this.translatefn('NOTES')
			// 		},
			// 	],
			// 	buttons: [
			// 		{
			// 			text: 'x',
			// 			cssClass: 'close-modal',
			// 			handler: data => {
			// 				//
			// 			}
			// 		},
			// 		{
			// 			text: this.translatefn('SPECIAL_ORDER'),
			// 			cssClass: 'check-coupon',
			// 			handler: alertdata => {
			// 				this.specialOrder(alertdata.notes);
			// 			}
			// 		}
			// 	]
			// });

			// prompt.present();
		}
	}*/

	/**
	 * inFav
	 */
	inFav() {
		return this.fav.inFav(this.product);
	}

	/**
	 * toggleFav
	 */
	toggleFav() {
		this.fav.toggle(this.product);
		this.addedFav();

	}

	selectProductType(value) {
		this.selectedType = this.types.filter(x => x.id == value)[0];
		this.cartItem.type = this.selectedType;
		this.price = this.selectedType.price ? this.selectedType.price : this.product.regular_price;
		this.priceAfterSale = this.selectedType.sale_price ? this.selectedType.sale_price : this.price;
		this.priceAsString = this.priceAfterSale.toString().split('.');
	}

	onColorChange() {
		this.productImage = this.productColor.image;
		this.color = this.productColor.name
	}

	/**
	 * toggleFav
	 */
	/**
	 * selectProductType
	 */
	// selectProductType() {
	// 	if (this.types && this.types.length == 1) return;
	// 	let inputs = [];
	// 	for (let type of this.types) {
	// 		inputs.push({
	// 			name: 'productType',
	// 			value: type,
	// 			label: type.name,
	// 			type: 'radio',
	// 			checked: type.id == this.selectedType.id ? true : false
	// 		});
	// 	}
	// 	// const alert = this.alertCtrl.create({
	// 	// 	title: this.translatefn('SELECT_TYPE'),
	// 	// 	inputs: inputs,
	// 	// 	buttons: [
	// 	// 		{
	// 	// 			text: this.translatefn('CANCEL'),
	// 	// 			role: 'cancel',
	// 	// 			handler: data => { }
	// 	// 		},
	// 	// 		{
	// 	// 			text: this.translatefn('OK'),
	// 	// 			handler: data => {
	// 	// 				this.cartItem.type = data;
	// 	// 				this.selectedType = data;
	// 	// 				this.price = data.price ? data.price : this.product.regular_price;
	// 	// 				this.priceAfterSale = parseFloat((this.price - (this.price * this.product.sale / 100)).toFixed(1));
	// 	// 			}
	// 	// 		}
	// 	// 	]
	// 	// });
	// 	alert.present();
	// }

	/**
	 * translatefn
	 * @param key
	 */
	translatefn(key): string {
		var x = "";
		this.translate.get(key).subscribe(t => {
			x = t;
		});
		return x;
	}
}
