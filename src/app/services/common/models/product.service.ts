import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Create_product } from 'src/app/contracts/product/create_product';
import { List_Product } from 'src/app/contracts/product/list_product';
import { List_Product_Image } from 'src/app/contracts/product/list_product_image';
import { HttpClientService } from '../http-client.service';
import { Get_Product } from 'src/app/contracts/product/get_product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }

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
  ): Promise<{ totalCount: number; products: List_Product[] }> {
    const promisData: Promise<{
      totalCount: number;
      products: List_Product[];
    }> = this.httpClientService
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

  async readById(id: string): Promise<Get_Product> {
    const readbyIdObservable: Observable<Get_Product> = this.httpClientService.get<Get_Product>(
      {
        controller: 'products',
        action: 'getProductById'
      },
      id
    );

    return await firstValueFrom(readbyIdObservable);
  }

  async readFilterName(value: string): Promise<string[]> {
    const readFilterNameObservable: Observable<string[]> = this.httpClientService.get<string[]>(
      {
        controller: 'products',
        action: 'getfilteredproductname'
      },
      value
    );

    return await firstValueFrom(readFilterNameObservable);
  }

  async readFilter(value: string): Promise<List_Product[]> {
    const readFilterNameObservable: Observable<List_Product[]> = this.httpClientService.get<List_Product[]>(
      {
        controller: 'products',
        action: 'getfilteredproduct'
      },
      value
    );

    return await firstValueFrom(readFilterNameObservable);
  }

  async update(id: string, product: Get_Product) {
    const updateObservable: Observable<any> = this.httpClientService.put({
      controller: 'products'
    },
      {
        id: id,
        ...product
      }
    )

    await firstValueFrom(updateObservable);
  }

  async delete(id: string) {
    const deleteObservable: Observable<List_Product> =
      this.httpClientService.delete(
        {
          controller: 'products',
        },
        id
      );

    await firstValueFrom(deleteObservable);
  }

  async readImages(
    id: string,
    successCallBack?: () => void
  ): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> =
      this.httpClientService.get<List_Product_Image[]>(
        {
          action: 'getproductimages',
          controller: 'products',
        },
        id
      );

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return await firstValueFrom(getObservable);
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete(
      {
        action: 'deleteproductimage',
        controller: 'products',
        queryString: `imageId=${imageId}`,
      },
      id
    );

    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(
    imageId: string,
    productId: string,
    successCallBack?: () => void
  ): Promise<void> {
    const changeShowcaseImageObservable = this.httpClientService.get(
      {
        controller: 'products',
        action: 'changeShowcase',
        queryString: `imageId=${imageId}&productId=${productId}`,
      });

    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }
}
