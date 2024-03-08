import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReciveFunctions } from 'src/app/constants/recive-functions';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { SignalRService } from 'src/app/services/common/signalR.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private aletrtify: AlertifyService,
    private signalRService: SignalRService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.signalRService.on(HubUrls.ProductHub,
      ReciveFunctions.ProductAddedMessageReceiveFunction,
      (message) => {
        this.aletrtify.message(message, {
          messageType: MessageType.Notify,
          position: Position.BottomRight,
        });
      }
    );
    this.signalRService.on(HubUrls.OrderHub,
      ReciveFunctions.OrderAddedMessageReceiveFunction,
      (message) => {
        this.aletrtify.message(message, {
          messageType: MessageType.Notify,
          position: Position.BottomRight,
        });
      }
    );
  }
}
