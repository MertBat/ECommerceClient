import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Order } from 'src/app/contracts/order/list_order';
import { SingleOrder } from 'src/app/contracts/order/single_order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClientService: HttpClientService) {}

  async create(addressId: string): Promise<void> {
    const createObservable: Observable<any> = this.httpClientService.post(
      {
        controller: 'orders',
      },
      {
        addressId: addressId,
      }
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

  async getOrderById(id: string): Promise<SingleOrder> {
    const getByIdObservable: Observable<SingleOrder> =
      this.httpClientService.get<SingleOrder>(
        {
          controller: 'orders',
        },
        id
      );

    return await firstValueFrom(getByIdObservable);
  }

  async completeOrder(id: string, status: boolean) {
    const completeOrderObservable: Observable<any> =
      this.httpClientService.post(
        {
          controller: 'orders',
          action: 'complete-order',
        },
        {
          id: id,
          orderStatus: status,
        }
      );

    await firstValueFrom(completeOrderObservable);
  }
}
