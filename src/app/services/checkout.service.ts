import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutUrl = 'http://localhost:8080/api/checkout/purchase';

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
}
