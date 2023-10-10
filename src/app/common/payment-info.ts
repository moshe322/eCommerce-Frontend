export class PaymentInfo {
  amount?: number;
  currency?: string;

  constructor(amount?: number, currency?: string) {
    this.amount = amount;
    this.currency = currency;
  }
}
