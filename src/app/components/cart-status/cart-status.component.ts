import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css'],
})
export class CartStatusComponent {
  private _cartService: CartService;
  totalQuantity: number = 0;
  totalPrice: number = 0.0;

  constructor(cartService: CartService) {
    this._cartService = cartService;
  }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  //update total quantity and price
  private updateCartStatus() {
    this._cartService.getTotalQuantity().subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );
    this._cartService.getTotalPrice().subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }
}
