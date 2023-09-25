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

  ngOnInit(): void {
    this.setCartDetails();
  }

  incrementQuantity(cartItem: CartItem) {
    this._cartService.addToCart(cartItem.product);
  }

  decrementQuantity(cartItem: CartItem) {
    this._cartService.removeFromCart(cartItem.product);
  }

  removeItem(cartItem: CartItem) {
    this._cartService.remove(cartItem.product);
  }

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
