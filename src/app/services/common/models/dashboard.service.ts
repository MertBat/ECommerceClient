import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Get_Sumamry } from 'src/app/contracts/Dashboard/get_summary';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClientService: HttpClientService) { }

  async getSummary():Promise<Get_Sumamry>{
    const getObservable: Observable<Get_Sumamry> = this.httpClientService.get({
      controller: 'dashboards',
      action: 'getsummary'
    })

    return await firstValueFrom(getObservable);
  }

  async getPdf(){
    const getPdfObservable: Observable<any> = this.httpClientService.get({
      controller: 'dashboards',
      action: 'getReportingPDf'
    })

    return await firstValueFrom(getPdfObservable);
  }
}
