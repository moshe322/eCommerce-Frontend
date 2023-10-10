import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutUrl = environment.apiUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.apiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) {}

  /**
   * Place order.
   * @param purchase
   * @returns Observable<any>
   * @memberof CheckoutService
   */
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post(this.checkoutUrl, purchase);
  }

  /**
   * Create payment intent.
   * @param paymentInfo
   * @returns
   * @memberof CheckoutService
   */
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post(this.paymentIntentUrl, paymentInfo);
  }
}
