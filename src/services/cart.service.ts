import { Injectable } from '@angular/core';
import { CartItemData } from '../models/models';

@Injectable()
export class Cart {

    cart: CartItemData[];

    constructor() {
        this.cart = localStorage.extraPharmCart ? JSON.parse(localStorage.extraPharmCart) : [];
    }

    inCart(product) {
        if (this.cart.findIndex(x => x.product.id == product.id) == -1) {
            return false;
        } else {
            return true;
        }
    }

    setCart(cart = []) {
        localStorage.extraPharmCart = JSON.stringify(cart);
        this.cart = cart;
    }

    addToCart(product: CartItemData) { // ADDS THE PRODUCT TO THE CART
        //if (this.cart.indexOf(product) == -1) { //indexOf = -1 means the the element does not exist REMEMBER Array is 0 index based
        if (this.cart.findIndex(x => x.id == product.id && x.type.id == product.type.id) == -1) { //indexOf = -1 means the the element does not exist REMEMBER Array is 0 index based
            //product.quantity = 1; // if statment that means if the item does not exist make it exist 
            this.cart.push(product); // array  method to add items in it push()
            this.saveCart(); //Excutes function that save the cart elements in the storge
        }
    }

    getCart() {
        return this.cart; //returns the array 
    }

    /*
    * removes one cartItem from cart (cart item as it)
    */
    removeFromCart(cartItem) {
        var index = this.cart.indexOf(cartItem);
        if (index > -1) {
            this.cart.splice(index, 1); //Remove the item from the cart`
            this.saveCart();
        }
    }

     /*
    * removes all cartItem from cart related to selected product(all types)
    */
    removeProductFromCart(product) {
        this.cart = this.cart.filter(x => x.product.id != product.id);
        this.saveCart();
    }

    saveCart() {
        localStorage.extraPharmCart = JSON.stringify(this.cart); //declaring the function not in var because it changble  it turns the cart details to a string that it will be jsn data later
    }

    updateQuantity(item) {
        var index = this.cart.findIndex(x =>
            x.id == item.id && x.type == item.type);
        if (index > -1) {
            this.cart[index].quantity = item.quantity;
            this.saveCart();
        }
        else
            this.addToCart(item);
    }

    increaseQuantity(product) {
        product.quantity = product.quantity + 1;
    }
    dicreaseQuantity(product) {
        if (product.quantity > 1) {
            product.quantity = product.quantity - 1;
        }
    }
    calculateTotal(cart = []) {
        if (!cart.length)
            cart = this.cart;

        var total = 0;
        cart.forEach(function (item) {
            var base = item.type && item.type.price > 0 ? item.type.price : item.product.regular_price;
            var price = base - (base * (item.product.sale / 100));
            total = total + price * item.quantity;

        });
        return total;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }
}