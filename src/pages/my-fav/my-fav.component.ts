import { Component, OnInit } from '@angular/core';
import { Globals } from '../../services/globals.service';
import { Favorites } from '../../services/favorites.service';
import { Cart } from '../../services/cart.service';

@Component({
	selector: 'my-fav',
	templateUrl: './my-fav.component.html',
	styleUrls: ['./my-fav.component.css']
})
export class MyFavouritesComponent implements OnInit {

	favorites: any[] = [];
	constructor(private fav: Favorites,
		private cart: Cart,
		private globals: Globals) {
		this.favorites = this.fav.getFav();
	}

	ngOnInit() {
	}

	toggleFav(product: any) {
		this.fav.toggle(product);
		this.globals.successAlert('DONE', 'SUCCEDD_REMOVED_FAV');
	}

	addToCart(product) {
		let cartItem: any = <any>{};
		cartItem.id = product.id;
		cartItem.product = product;
		cartItem.quantity = 1;
		this.cart.addToCart(cartItem);
		this.globals.successAlert('DONE', 'IN_CART');
	}
}
