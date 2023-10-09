import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private checkoutUrl = environment.apiUrl + '/checkout/purchase';

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
