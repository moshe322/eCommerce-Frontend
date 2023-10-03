import { Address } from './address';
import { Customer } from './customer';
import { Order } from './order';
import { OrderItem } from './order-item';

export class Purchase {
  private customer: Customer;
  private shippingAddress: Address;
  private billingAddress: Address;
  private order: Order;
  private orderItems: OrderItem[];

  constructor(
    customer: Customer,
    shippingAddress: Address,
    billingAddress: Address,
    order: Order,
    orderItems: OrderItem[]
  ) {
    this.customer = customer;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.order = order;
    this.orderItems = orderItems;
  }

  get _customer(): Customer {
    return this.customer;
  }
  set _customer(value: Customer) {
    this.customer = value;
  }

  get _shippingAddress(): Address {
    return this.shippingAddress;
  }
  set _shippingAddress(value: Address) {
    this.shippingAddress = value;
  }

  get _billingAddress(): Address {
    return this.billingAddress;
  }
  set _billingAddress(value: Address) {
    this.billingAddress = value;
  }

  get _order(): Order {
    return this.order;
  }
  set _order(value: Order) {
    this.order = value;
  }

  get _orderItems(): OrderItem[] {
    return this.orderItems;
  }
  set _orderItems(value: OrderItem[]) {
    this.orderItems = value;
  }
}
