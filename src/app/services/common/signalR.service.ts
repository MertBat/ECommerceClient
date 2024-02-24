import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor() {}

  private _connection: HubConnection;
  get connection(): HubConnection {
    return this._connection;
  }

  //başlatılmış bir hub verir
  start(hubUrl: string) {
    if (
      !this.connection ||
      this._connection?.state == HubConnectionState.Disconnected
    ) {
      console.log("Connection exists or is disconnected. Creating new connection...");
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
      this._connection = hubConnection;
    } else {
      console.log("No need to create a new connection.");
    }

    //Eğer kopan bağlantı tekrardan sağlanırsa durum yönetimi sağlar.bağlantı sağlayanın connectionId de verir
    this._connection.onreconnected((connectionId) =>
      console.log('Reconnected')
    );

    //Kopan bağlantının tekrar sağlanmakta olduğunu belirtir.
    this._connection.onreconnecting((error) => console.log('Reconnecting'));

    //Bağlantı koptuğunda
    this._connection.onclose((error) => console.log('connection close'));
}


  //SignalR üzerinden diğer clientlara mesaj göndermek gerekilirse
  invoke(
    procedureName: string,
    message: any,
    successCallBack?: (value) => void,
    errorCallBack?: (error) => void
  ) {
    this.connection
      .invoke(procedureName, message)
      .then(successCallBack)
      .catch(errorCallBack);
  }

  //Serverdan gelecek olan anlık mesajlar runtime da yakalanmasını sağlar.
  on(procedureName: string, callBack: (...message: any) => void) {
    this.connection.on(procedureName, callBack);
  }
}
