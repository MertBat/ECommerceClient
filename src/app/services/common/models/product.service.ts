import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_product } from 'src/app/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from 'src/app/contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) {}

  create(product: Create_product, successCallBack?: any, errorCallBack?: any) {
    this.httpClientService
      .post(
        {
          controller: 'products',
        },
        product
      )
      .subscribe(
        (result) => {
          successCallBack();
          alert('başarılı');
        },
        (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string; value: Array<string> }> =
            errorResponse.error;
          let message = '';
          _error.forEach((v, index) => {
            v.value.forEach((_v, _index) => {
              message += `${_v}<br>`;
            });
          });
          errorCallBack(message);
        }
      );
  }

  async read(
    page: number = 0,
    size: number = 5,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{totalCount: number; products: List_Product[];}> {
    const promisData: Promise<{totalCount: number; products: List_Product[];}> = this.httpClientService
      .get<{ totalCount: number; products: List_Product[] }>({
        controller: 'products',
        queryString: `page=${page}&size=${size}`,
      })
      .toPromise();

    promisData
      .then((d) => successCallBack())
      .catch((errorCallBackResponse: HttpErrorResponse) =>
        errorCallBack(errorCallBackResponse.message)
      );

    return await promisData;
  }

  async delete(id:string){
    const deleteObservable: Observable<List_Product> = this.httpClientService.delete({
      controller: "products"
    }, id)

    await firstValueFrom(deleteObservable);
  }
}
