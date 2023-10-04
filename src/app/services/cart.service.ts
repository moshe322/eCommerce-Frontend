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

  storage: Storage = sessionStorage;

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this._cartItems = data;
      this.updateStatus();
    }
  }

  /**
   * Save cart items to session storage
   * @private
   * @memberof CartService
   */
  private saveCartItems(): void {
    this.storage.setItem('cartItems', JSON.stringify(this._cartItems));
  }

  /**
   * Get cart items
   * @returns CartItem[]
   * @memberof CartService
   */
  get cartItems(): CartItem[] {
    return this._cartItems;
  }

  /**
   * Remove product from cart.
   * Check if product exists in cart.
   * If exists, remove item from cart.
   * Update total quantity and price.
   * @param product
   * @returns void
   * @memberof CartService
   */
  remove(product: Product): void {
    let itemIndex = this._cartItems.findIndex(
      (item) => item.product.id == product.id
    );
    if (itemIndex > -1) {
      this._cartItems.splice(itemIndex, 1);
    }
    this.updateStatus();
  }

  /**
   * Add product to cart.
   * Check if product already exists in cart.
   * If exists, increment quantity.
   * Else add new item to cart.
   * Update total quantity and price.
   * @param product
   * @returns void
   * @memberof CartService
   */
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

  /**
   * Remove product from cart.
   * Check if product exists in cart.
   * If exists, decrement quantity.
   * If quantity is 0, remove item from cart.
   * Update total quantity and price.
   * @param product
   * @returns void
   * @memberof CartService
   */
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

  /**
   * Get total quantity
   * Loop through cart items and calculate total quantity
   * Publish the new total quantity to all subscribers
   * @returns Observable<number>
   * @memberof CartService
   */
  getTotalQuantity(): Observable<number> {
    let totalQuantity: number = 0;
    for (let item of this._cartItems) {
      totalQuantity += item.quantity;
    }
    this._totalQuantitySubject.next(totalQuantity);
    return this._totalQuantitySubject.asObservable();
  }

  /**
   * Get total price
   * Loop through cart items and calculate total price
   * Publish the new total price to all subscribers
   * @returns Observable<number>
   * @memberof CartService
   */
  getTotalPrice(): Observable<number> {
    let totalPrice: number = 0;
    for (let item of this._cartItems) {
      totalPrice += item.quantity * item.product.unitPrice;
    }
    this._totalPriceSubject.next(totalPrice);
    return this._totalPriceSubject.asObservable();
  }

  /**
   * Update total quantity and price
   * @private
   * @memberof CartService
   */
  private updateStatus(): void {
    this.getTotalPrice();
    this.getTotalQuantity();
    this.saveCartItems();
  }

  /**
   * Clear cart
   * @returns void
   * @memberof CartService
   */
  clearCart(): void {
    this._cartItems = [];
    this._totalPriceSubject.next(0);
    this._totalQuantitySubject.next(0);
  }
}
