import { Component, OnInit, Input } from '@angular/core';
import { CartItemData, ProductTypeData, ProductData } from '../../models/models';
import { Favorites } from '../../services/favorites.service';
import { Cart } from '../../services/cart.service';
import { Config } from "../../config";
import { Repo } from '../../services/repo.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '../../services/globals.service';
import { Router } from '@angular/router';


@Component({
	selector: 'product-item',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css']
})
export class ProductItemComponent implements OnInit {
	busy: Promise<any>;
	// col
	@Input() col: any = 'col-md-3 col-sm-6';
	// template
	@Input() template: any = 'larg';
	// navId
	@Input() navId: number;
	// check if component is called from favorites page
	@Input() isFav: boolean;
	// used for products in cart
	@Input() cartItem: CartItemData;
	// actual product object
	@Input() product: ProductData = <ProductData>{};
	// set product type
	type: ProductTypeData = <ProductTypeData>{};
	catSlug: any;
	// original product price
	price: number = 0;
	// product price after sale
	priceAfterSale: number = 0;
	priceAsString: string[];
	// perfume title
	showBrandInTitle: boolean = false;
	// hasAttributes
	hasAttributes: boolean = false;
	// is perfume
	isPerfume: boolean = false;
	// assets url
	imagesUrlBase = Config.StorageUrl;
	brand: string;

	constructor(
		private fav: Favorites,
		private cart: Cart,
		private repo: Repo,
		private translate: TranslateService,
		private toastr: ToastrService,
		private globals: Globals,
		private router: Router

	) {
	}

	/**
	 * ngOnInit
	 */
	ngOnInit() {
		this.brand = this.product.attributes['الماركة'] ? this.product.attributes['الماركة'].name : null;
		this.brand = this.product.attributes['Pharmacy Brands'] ? this.product.attributes['Pharmacy Brands'].name : this.brand;
		if (this.navId && this.product.id == this.navId)
			this.sepecialAlert();
		// resolve prices on component init
		this.resolvePrices();
		// check if to show brand in title
		if (this.product.category_id == 7 && JSON.stringify(this.product.attributes) !== '[]' && this.product.attributes.hasOwnProperty('Company') && this.product.attributes.Company.name != '') {
			this.showBrandInTitle = true;
		}

		this.isPerfume = this.product.category_id == 7 ? true : false;

		if (JSON.stringify(this.product.attributes) !== '[]') {
			this.hasAttributes = true;
		}
	}

	/**
	 * specialOrder
	 * Order products that not in inventory
	 */
	addedFav() {
		if (this.inFav() == true) {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("SUCCEDD_ADDED_FAV"));
		}
		else {
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
	specialOrder(notes = "") {
		if (!this.repo.isLoggedIn()) {
			//
		} else {
			var products = [];
			products.push(this.prepareCartItem(this.product));
			var orderItems = {
				products: products,
				notes: notes,
				is_special: "YES"
			}

			this.repo.placeOrder(orderItems).subscribe(data => {
				this.router.navigate(['my-orders/' + data.id]);
			});
		}
	}
	/**
	 * specialOrder
	 * Order products that not in inventory
	 */
	// specialOrder() {

	// 	var products = [];
	// 	products.push({
	// 		id: this.product.id,
	// 		product: this.product,
	// 		quantity: 1,
	// 		type: this.selectedType
	// 	});
	// 	var orderItems = {
	// 		products: products,
	// 		notes: this.specialNotes,
	// 		is_special: "YES"
	// 	}

	// 	this.busy = this.repo.placeOrder(orderItems).subscribe(data => {
	// 		this.router.navigate(['my-orders/' + data.id]);
	// 	});
	// }

	sepecialAlert() {
		if (!this.repo.isLoggedIn()) {
			// this.globals.loginRegisterAlert(this.navCtrl, ProductsPage, { id: this.product.category_id, product_id: this.product.id });
		} else {

		}
	}

	translatefn(key): string {
		var x = "";
		this.translate.get(key).subscribe(t => {
			x = t;
		});
		return x;
	}

	/**
	 * resolvePrices
	 * Responsible for resolving product prices depening on several criteria
	 */
	resolvePrices() {
		this.type = this.cartItem ? this.cartItem.type : this.product.product_types.find(x => x.is_default == 1);
		if (!this.type && this.product.product_types.length) {
			this.type = this.product.product_types[0];
		}
		this.price = this.type != null && this.type.price > 0 ? this.type.price : this.product.regular_price;
		this.priceAfterSale = parseFloat((this.price - (this.price * this.product.sale / 100)).toFixed(2));
		this.priceAsString = this.priceAfterSale.toString().split('.');
	}

	/**
	 * toggleFav
	 */
	inFav() {
		return this.fav.inFav(this.product);
	}
	toggleFav() {
		this.fav.toggle(this.product);
		this.addedFav();

	}

	/**
	 * inFav
	 * Check if product already in favorites
	 */


	/**
	 * inCart
	 * Check if product has been added to cart or not
	 * @param product
	 */
	inCart(product) {
		var inCart = this.cartItem ? true : this.cart.inCart(product);
		return inCart;
	}


	/**
	 * addToCart
	 * Add the product to cart
	 */
	addToCart() {
		if (this.cartItem) {
			this.removeFromCart(this.cartItem);
			this.addedCart();
		}
		else if (this.cart.inCart(this.product)) {
			this.cart.removeProductFromCart(this.product);
			this.addedCart();
		}
		else {
			var cartItem = this.prepareCartItem(this.product);
			this.cart.addToCart(cartItem);
			this.addedCart();
		}
	}

	/**
	 * removeFromCart
	 * Remove product from cart
	 * @param product
	 */
	removeFromCart(product) {
		this.cart.removeFromCart(product);
		this.cart.calculateTotal();
	}

	/**
	 * prepareCartItem
	 * Prepare product in order to add it to cart
	 * @param product
	 */
	prepareCartItem(product: ProductData) {
		let cartItem = <CartItemData>{
			id: product.id,
			product: product,
			quantity: 1,
			type: this.type,
		};
		return cartItem;
	}

	attrHasProperty(key) {
		if (this.product.attributes.hasOwnProperty(key) || key in this.product.attributes) {
			return true;
		}
		return false;
	}
}
