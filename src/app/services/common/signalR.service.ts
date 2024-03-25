import { Inject, Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor(@Inject('baseSignalRUrl') private baseSignalRUrl: string) {}

  //başlatılmış bir hub verir
  start(hubUrl: string) {
    hubUrl = this.baseSignalRUrl + hubUrl;
    const builder: HubConnectionBuilder = new HubConnectionBuilder();

    const hubConnection: HubConnection = builder
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .then(() => console.log('Connected'))
      .catch((error) =>
        setTimeout(() => {
          this.start(hubUrl);
        }, 2000)
      );

    //Eğer kopan bağlantı tekrardan sağlanırsa durum yönetimi sağlar.bağlantı sağlayanın connectionId de verir
    hubConnection.onreconnected((connectionId) =>
      console.log('Reconnected')
    );

    //Kopan bağlantının tekrar sağlanmakta olduğunu belirtir.
    hubConnection.onreconnecting((error) => console.log('Reconnecting'));

    //Bağlantı koptuğunda
    hubConnection.onclose((error) => console.log('connection close'));

    return hubConnection;
  }

  //SignalR üzerinden diğer clientlara mesaj göndermek gerekilirse
  invoke(
    hubUrl: string,
    procedureName: string,
    message: any,
    successCallBack?: (value) => void,
    errorCallBack?: (error) => void
  ) {
    this.start(hubUrl)
      .invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }

  //Serverdan gelecek olan anlık mesajlar runtime da yakalanmasını sağlar.
  on(hubUrl:string, procedureName: string, callBack: (...message: any) => void) {
    this.start(hubUrl).on(procedureName, callBack);
  }
}
