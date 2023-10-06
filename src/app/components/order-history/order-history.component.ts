import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistory[] = [];

  constructor(
    private auth: AuthService,
    private orderHistory: OrderHistoryService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((profile) => {
      if (profile) {
        this.orderHistory.getOrders(profile.email ?? '').subscribe((data) => {
          this.orderHistoryList = data._embedded.orders;
        });
      }
    });
  }
}
