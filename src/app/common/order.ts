export class Order {
  private totalQuantity: number;
  private totalPrice: number;

  constructor(totalQuantity: number, totalPrice: number) {
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  get _totalQuantity(): number {
    return this.totalQuantity;
  }
  set _totalQuantity(value: number) {
    this.totalQuantity = value;
  }

  get _totalPrice(): number {
    return this.totalPrice;
  }
  set _totalPrice(value: number) {
    this.totalPrice = value;
  }
}
