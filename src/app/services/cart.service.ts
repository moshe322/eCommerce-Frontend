import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItems: CartItem[] = [];
  private _totalQuantitySubject = new BehaviorSubject<number>(0);
  private _totalPriceSubject = new BehaviorSubject<number>(0);

  //add product to cart
  //check if product already exists in cart
  //if exists, increment quantity
  //else add new item to cart
  //update total quantity and price
  addToCart(product: Product): void {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this._cartItems.length > 0) {
      existingCartItem = this._cartItems.find(
        (item) => item.product.id === product.id
      );
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      existingCartItem!.quantity++;
    } else {
      let cartItem: CartItem = new CartItem(product, 1);
      this._cartItems.push(cartItem);
    }
    this.updateStatus();
  }

  //remove product from cart
  //check if product exists in cart
  //if exists, decrement quantity
  //if quantity is 0, remove item from cart
  //update total quantity and price
  removeFromCart(product: Product): void {
    let existingCartItem: CartItem | null = null;
    for (let item of this._cartItems) {
      if (item.product.id == product.id) {
        existingCartItem = item;
        break;
      }
    }
    if (existingCartItem != null) {
      existingCartItem.quantity--;
      if (existingCartItem.quantity == 0) {
        this._cartItems.splice(this._cartItems.indexOf(existingCartItem), 1);
      }
    }
    this.updateStatus();
  }

  //get total quantity
  //loop through cart items and calculate total quantity
  //publish the new total quantity to all subscribers
  getTotalQuantity(): Observable<number> {
    let totalQuantity: number = 0;
    for (let item of this._cartItems) {
      totalQuantity += item.quantity;
    }
    this._totalQuantitySubject.next(totalQuantity);
    return this._totalQuantitySubject.asObservable();
  }

  //get total price
  //loop through cart items and calculate total price
  //publish the new total price to all subscribers
  getTotalPrice(): Observable<number> {
    let totalPrice: number = 0;
    for (let item of this._cartItems) {
      totalPrice += item.quantity * item.product.unitPrice;
    }
    this._totalPriceSubject.next(totalPrice);
    return this._totalPriceSubject.asObservable();
  }

  private updateStatus(): void {
    this.getTotalPrice();
    this.getTotalQuantity();
  }

  clearCart(): void {
    this._cartItems = [];
  }
}
