import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateOrder } from 'src/app/contracts/order/create_order';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClientService: HttpClientService) {}

  async create(order: CreateOrder): Promise<void> {
    const createObservable: Observable<any> = this.httpClientService.post({
      controller: "orders"
    }, order);

    await firstValueFrom(createObservable);
  }
}
