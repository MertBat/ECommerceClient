import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthorizeMenu } from 'src/app/contracts/authorize-configurations/authorize_menu';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private httpClientService: HttpClientService) {}

  async getAuthorizeDefinitionEndPoints() {
    const authorizeObservable: Observable<AuthorizeMenu[]> = this.httpClientService.get<AuthorizeMenu[]>({
      controller: "ApplicationServices"
    });

    return await firstValueFrom(authorizeObservable);
  }
  
}
