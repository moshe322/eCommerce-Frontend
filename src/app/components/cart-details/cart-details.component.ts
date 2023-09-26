import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  private _cartService: CartService;

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(cartService: CartService) {
    this._cartService = cartService;
  }

  /**
   * Get cart details when component is initialized.
   * @memberof CartDetailsComponent
   */
  ngOnInit(): void {
    this.setCartDetails();
  }

  /**
   * Increment quantity of product in cart.
   * @param cartItem
   * @memberof CartDetailsComponent
   */
  incrementQuantity(cartItem: CartItem) {
    this._cartService.addToCart(cartItem.product);
  }

  /**
   * Decrement quantity of product in cart.
   * @param cartItem
   * @memberof CartDetailsComponent
   */
  decrementQuantity(cartItem: CartItem) {
    this._cartService.removeFromCart(cartItem.product);
  }

  /**
   * Remove product from cart.
   * @param cartItem
   * @memberof CartDetailsComponent
   */
  removeItem(cartItem: CartItem) {
    this._cartService.remove(cartItem.product);
  }

  /**
   * Set cart details.
   * Get cart items, total price and total quantity.
   * @private
   * @memberof CartDetailsComponent
   */
  private setCartDetails() {
    this.cartItems = this._cartService.cartItems;

    this._cartService
      .getTotalPrice()
      .subscribe((totalPrice) => (this.totalPrice = totalPrice));

    this._cartService
      .getTotalQuantity()
      .subscribe((totalQuantity) => (this.totalQuantity = totalQuantity));
  }
}
