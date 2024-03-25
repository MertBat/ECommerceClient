import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private httpClientService: HttpClientService) {}

  async getAll(page?: number, size?: number): Promise<any> {
    let queryString = '';
    let action = "allRoles"
    if (page !== undefined && size !== undefined) {
      queryString = `page=${page}&size=${size}`;
      action = "roles"
    }
    const getAllObservable: Observable<any> = this.httpClientService.get({
      controller: 'roles',
      action: action,
      queryString: queryString,
    });

    return await firstValueFrom(getAllObservable);
  }

  async create(name: string) {
    const createObservable: Observable<any> = this.httpClientService.post(
      {
        controller: 'roles',
      },
      {
        name: name,
      }
    );

    await firstValueFrom(createObservable);
  }
}
