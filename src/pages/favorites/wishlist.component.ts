import { Component, OnInit, Input } from '@angular/core';
import { Favorites } from '../../services/favorites.service';
import { Cart } from "../../services/cart.service";
import { CartItemData, ProductTypeData, ProductData } from '../../models/models';
import { ToastrService } from 'ngx-toastr';
import { Repo } from '../../services/repo.service';
import { Globals } from '../../services/globals.service';


@Component({
	selector: 'app-wishlist',
	templateUrl: './wishlist.component.html',
	styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
	busy: Promise<any>;
	selectedType: ProductTypeData = <ProductTypeData>{};
	cartItem: CartItemData = <CartItemData>{};
	attrs: any;
	favorites: any = [];
	@Input() product: ProductData = <ProductData>{};
	type: ProductTypeData = <ProductTypeData>{};
	loggedIn: boolean;
	constructor(
		public fav: Favorites,
		public cart: Cart,
		private toastr: ToastrService,
		public repo: Repo,
		public globals: Globals
	) {

	}

	removedFav() {
		this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("SUCCEDD_REMOVED_FAV"));	
	}

	addedCart() {
		if(this.inCart(this.product) == true) {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("IN_CART"));
		} 
		else {
			this.toastr.success(this.globals.translatefn("DONE"), this.globals.translatefn("OUT_CART"));
		}
	}

	toggleFav(product: any) {
		this.fav.toggle(product);
		this.removedFav();
	}
		inCart(product) {
			var inCart = this.cartItem ? true : this.cart.inCart(product);
			return inCart;
		}
		
	addToCart(product) {		
		var cartItem = this.prepareCartItem(product);
		this.cart.addToCart(cartItem);
		this.addedCart();
				
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


	ngOnInit() {
		this.favorites = this.fav.getFav();
		this.loggedIn = this.repo.isLoggedIn();
	}

}
