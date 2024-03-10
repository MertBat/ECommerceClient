import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Order } from 'src/app/contracts/order/list_order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClientService: HttpClientService) {}

  async create(order: Create_Order): Promise<void> {
    const createObservable: Observable<any> = this.httpClientService.post(
      {
        controller: 'orders',
      },
      order
    );

    await firstValueFrom(createObservable);
  }

  async getAll(
    page: number = 0,
    size: number = 5,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalOrderCount: number; orders: List_Order[] }> {
    const getAllObservable: Observable<{
      totalOrderCount: number;
      orders: List_Order[];
    }> = this.httpClientService.get({
      controller: 'orders',
      queryString: `page=${page}&size=${size}`,
    });

    const promiseData = firstValueFrom(getAllObservable);
    promiseData
      .then((value) => successCallBack())
      .catch((error) => errorCallBack(error));

    return await promiseData;
  }
}
