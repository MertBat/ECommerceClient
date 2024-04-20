import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(private httpClientServices: HttpClientService) {}

  async get(): Promise<List_Basket_Item[]> {
    const getObservable: Observable<List_Basket_Item[]> =
      this.httpClientServices.get({
        controller: 'baskets',
      });

    return await firstValueFrom(getObservable);
  }

  async getCount(): Promise<number> {
    const getCountObservable: Observable<number> =
      this.httpClientServices.get({
        controller: 'baskets',
        action: 'GetBasketItemCount'
      });

    return await firstValueFrom(getCountObservable);
  }

  async add(basketItem: Create_Basket_Item): Promise<void> {
    const addObservable: Observable<any> = this.httpClientServices.post(
      {
        controller: 'baskets',
      },
      basketItem
    );

    await firstValueFrom(addObservable);
  }

  async put(basketItem: Update_Basket_Item): Promise<void> {
    const updateObservable: Observable<any> = this.httpClientServices.put(
      {
        controller: 'baskets',
      },
      basketItem
    );

    await firstValueFrom(updateObservable);
  }

  async delete(basketItemId: string): Promise<void> {
    const deleteObservable: Observable<any> = this.httpClientServices.delete(
      {
        controller: 'baskets',
      },
      basketItemId
    );

    await firstValueFrom(deleteObservable);
  }
}
