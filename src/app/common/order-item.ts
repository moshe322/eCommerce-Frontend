import { CartItem } from './cart-item';

export class OrderItem {
  private unitPrice: number;
  private quantity: number;
  private productId: string;

  constructor(cartItem: CartItem) {
    this.unitPrice = cartItem.product.unitPrice;
    this.quantity = cartItem.quantity;
    this.productId = String(cartItem.product.id);
  }

  get _unitPrice(): number {
    return this.unitPrice;
  }
  set _unitPrice(value: number) {
    this.unitPrice = value;
  }

  get _quantity(): number {
    return this.quantity;
  }
  set _quantity(value: number) {
    this.quantity = value;
  }

  get _productId(): string {
    return this.productId;
  }
  set _productId(value: string) {
    this.productId = value;
  }
}
