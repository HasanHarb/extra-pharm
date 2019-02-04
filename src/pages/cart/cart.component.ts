import { Component, OnInit } from '@angular/core';
import { Cart } from '../../services/cart.service';
import { Config } from '../../config';
import { ToastrService } from 'ngx-toastr';
import { Repo } from '../../services/repo.service';
import { Globals } from '../../services/globals.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
	busy: any;
	couponBusy: boolean = false;
	isLoggedIn: boolean = false;
	couponNotValid: any = false;
	orderFlag: boolean = true;

	imagesUrlBase = Config.StorageUrl;
	discount = 0;
	couponItem: any = <any>{};
	orderItem: any = <any>{};
	activeItemsInCart: any = [];
	outInvItemsInCart: any = [];
	creditCardItem: any = <any>{};
	creditCardForm: FormGroup;

  errorArray: string[] = [];
  host = "";

	constructor(private cart: Cart,
		private repo: Repo,
		private globals: Globals,
		private router: Router,
		private formBuilder: FormBuilder,
		private toastr: ToastrService) {

      	this.host = window.location.host;
		this.activeItemsInCart = this.cart.getCart().filter(x => x.product.in_stock);
		this.outInvItemsInCart = this.cart.getCart().filter(x => !x.product.in_stock);
		this.refeshCartItems();
		this.isLoggedIn = repo.isLoggedIn();
		// init credit card form with validation
		this.creditCardForm = this.formBuilder.group({
			card_number: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
			csv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
			month: ['', [Validators.required, Validators.max(12), Validators.minLength(1)]],
			year: ['', [Validators.required, Validators.min((new Date).getFullYear())]]
		});

		this.orderItem.mobile = this.repo.isLoggedIn() ? JSON.parse(localStorage.EFUserData).mobile : '';
		this.orderItem.address = this.repo.isLoggedIn() ? JSON.parse(localStorage.EFUserData).address : '';
	}

	ngOnInit() {
	}

	placeOrder() {
		if (!this.isLoggedIn) {
			this.router.navigate(['/login'], { queryParams: { source: '_cart' } });
		}
		else {
			this.orderFlag = true;
			this.errorArray = [];
			if (!this.activeItemsInCart.length && !this.outInvItemsInCart.length) {
				this.errorArray.push('EMPTY_CART');
				this.orderFlag = false;
			}
			if (!this.orderItem.mobile) {
				this.errorArray.push('MOBILE_REQUIRED');
				this.orderFlag = false;
			}
			if (!this.orderItem.address) {
				this.errorArray.push('ADDRESS_REQUIRED');
				this.orderFlag = false;
			}
			if (!this.orderItem.payment_method) {
				this.errorArray.push('PAYMENT_METHOD_REQUIRED');
				this.orderFlag = false;
			}
			else if (this.orderItem.payment_method == 'VISA') {
				if (this.creditCardForm.invalid) {
					this.errorArray.push("CREDIT_CARD_FILL_FIELDS");
					this.orderFlag = false;
				} else {
					this.repo.payWithTranzila(this.creditCardItem).subscribe((res: any) => {
						if (res.status != "000") {
							this.errorArray.push('CREDIT_CARD_ERROR');
							this.orderFlag = false;
						}
					});
				}
			}
			if (this.orderFlag) {
				this.orderItem.products = this.cart.getCart();
				this.orderItem.coupon = this.couponItem.key;
				if (this.outInvItemsInCart.length > 0) {
					this.orderItem.is_special= "yes";
					this.orderItem.notes= "Special Order (out of stock)";
				}
				this.busy = this.repo.placeOrder(this.orderItem).subscribe(data => {
					this.cart.clearCart();
					this.router.navigate(['thanks'], { queryParams: { orderId: data.id }});
				});
			}
		}
	}

	choosePaymentMethod(method) {
		this.orderItem.payment_method = method;
	}

	refeshCartItems() {
		this.repo.refreshCartProducts(this.cart.getCart()).subscribe(data => {
			this.cart.setCart(data);
			this.activeItemsInCart = this.cart.getCart().filter(x => x.product.in_stock);
			this.outInvItemsInCart = this.cart.getCart().filter(x => !x.product.in_stock);
		});
	}

	checkCoupon() {
		this.couponBusy = true;
		this.couponNotValid = false;

		if (!this.repo.isLoggedIn()) {
			this.router.navigate(['/login'], { queryParams: { source: '_cart' } });

			this.couponBusy = false;
		}
		else {
			this.repo.checkCoupon(this.couponItem.key).subscribe(data => {
				this.couponBusy = false;
				if (data) {
					this.couponItem = data;
					this.calculateDiscount();
				}
				else {
					this.couponNotValid = true;
				}
			}, err => this.couponBusy = false);
		}
	}

	calculateDiscount() {
		if (this.couponItem.type == 'FIXED')
			this.discount = this.couponItem.value;
		else if (this.couponItem.type == 'PERCENT')
			this.discount = (this.getTotal() * this.couponItem.value) / 100;
		else
			this.discount = 0;
	}

	cancelCoupon() {
		this.couponItem = <any>{};
		this.calculateDiscount();
	}

	changeQuantity(char, item) {
		switch (char) {
			case '+':
				item.quantity = item.quantity + 1;
				break;
			case '-':
				if (item.quantity > 1)
					item.quantity = item.quantity - 1;
				break;
		}
		this.cart.updateQuantity(item);
	}

	removedCart() {
		this.toastr.success('!Done', 'Your item has been removed from cart');
	}

	resolvePrices(item) {
		let type = null;
		if (item.product.product_types) {
			type = item.product.product_types.find(x => x.is_default == 1) || item.product.product_types[0];
		}
		let price = type != null && type.price > 0 ? type.price : item.product.regular_price;
		return parseFloat(((price - (price * item.product.sale / 100))).toFixed(2));

	}

	remove(product, source = 'in') {
		this.cart.removeFromCart(product); //Nav parm when move form view to onther, We called a function attributes 
		if (source == "in") {
			var index = this.activeItemsInCart.indexOf(product);
			if (index > -1) {
				this.activeItemsInCart.splice(index, 1); //Remove the item from the cart`
				this.getTotal();
			}
		}
		else if (source == "out") {
			var index = this.outInvItemsInCart.indexOf(product);
			if (index > -1) {
				this.outInvItemsInCart.splice(index, 1); //Remove the item from the cart`
			}
		}
	}

	getTotal() {
		return this.cart.calculateTotal(this.activeItemsInCart);
	}

	isPerfumeAndHasAttributes(product) {
		var isPerfume = product.category_id == 7 ? true : false;

		if (JSON.stringify(product.attributes) !== '[]') {
			var hasAttributes = true;
		}

		return isPerfume && hasAttributes;
	}
}
