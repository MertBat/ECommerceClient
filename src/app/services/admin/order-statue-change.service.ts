import { Injectable } from '@angular/core';
import { OrderService } from '../common/models/order.service';
import { Subject } from 'rxjs';
import { List_Order } from 'src/app/contracts/order/list_order';

@Injectable({
  providedIn: 'root',
})
export class OrderStatueChangeService {
  order = new Subject<{ totalOrderCount: number; orders: List_Order[] }>();
  $order = this.order.asObservable();

  constructor(private orderService: OrderService) {}

  async getOrders() {
   const getOrder = await this.orderService.getAll();
   this.order.next(getOrder);
  }
}
