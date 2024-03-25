import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { List_Role } from 'src/app/contracts/role/list_role';
import { Observable, firstValueFrom, observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthoizationEndpointService {

  constructor(private httpService: HttpClientService) { }

  async assignEndPoint(roles: string[], code:string, menu:string, successCallBack?:()=> void){
      const assignEndPointObservable: Observable<any> = this.httpService.post({
        controller: "AuthorizationAndpoints",
      },{
        roles: roles,
        code: code,
        menu: menu
      })

      const promiseData = assignEndPointObservable.subscribe({
        next: successCallBack
      })

      await promiseData;
  }

  async getRolesEndpoint(code:string){
    const getRolesEndpointObservable:Observable<any> = this.httpService.get({
      controller: "AuthorizationAndpoints"
    }, code);

    return await firstValueFrom(getRolesEndpointObservable);
  }
}
