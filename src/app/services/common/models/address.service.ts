import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { List_Addresses } from 'src/app/contracts/address/list_addresses';
import { Observable, firstValueFrom } from 'rxjs';
import { Add_Address } from 'src/app/contracts/address/add_address';
import { Update_Address } from 'src/app/contracts/address/update_address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private httpClientService: HttpClientService) {}

  async getAll(): Promise<List_Addresses[]> {
    const getAllObservable: Observable<List_Addresses[]> =
      this.httpClientService.get({
        controller: 'addresses',
      });

    return await firstValueFrom(getAllObservable);
  }

  async getById(id: string): Promise<Update_Address> {
    const getByIdObservable: Observable<Update_Address> =
      this.httpClientService.get({
        controller: 'addresses',
        action: 'getaddressbyid',
      },id);

      return await firstValueFrom(getByIdObservable);
  }

  async create(address: Add_Address) {
    const createObservable: Observable<any> = this.httpClientService.post(
      {
        controller: 'addresses',
      },
      address
    );

    await firstValueFrom(createObservable);
  }

  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'addresses',
      },
      id
    );

    await firstValueFrom(deleteObservable);
  }

  async update(address: Update_Address) {
    const updateObservable: Observable<any> = this.httpClientService.put(
      {
        controller: 'addresses',
      },
      address
    );

    await firstValueFrom(updateObservable);
  }
}
