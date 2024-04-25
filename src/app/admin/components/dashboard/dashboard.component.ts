import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReciveFunctions } from 'src/app/constants/recive-functions';
import { Get_Sumamry } from 'src/app/contracts/Dashboard/get_summary';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { DashboardService } from 'src/app/services/common/models/dashboard.service';
import { SignalRService } from 'src/app/services/common/signalR.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseComponent implements OnInit {
  summary: Get_Sumamry;
  file:any;
  constructor(
    spinner: NgxSpinnerService,
    private aletrtify: AlertifyService,
    private signalRService: SignalRService,
    private dashboardService: DashboardService
  ) {
    super(spinner);
  }

  async ngOnInit() {
    await this.getSumamary();
    this.signalRService.on(
      HubUrls.ProductHub,
      ReciveFunctions.ProductAddedMessageReceiveFunction,
      (message) => {
        this.aletrtify.message(message, {
          messageType: MessageType.Notify,
          position: Position.BottomRight,
        });
      }
    );
    this.signalRService.on(
      HubUrls.OrderHub,
      ReciveFunctions.OrderAddedMessageReceiveFunction,
      (message) => {
        this.aletrtify.message(message, {
          messageType: MessageType.Notify,
          position: Position.BottomRight,
        });
      }
    );
  }

  async getSumamary() {
    this.showSpinner(SpinnerType.BallAtom);
    this.summary = await this.dashboardService.getSummary();
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async downloadPdf() {
    this.showSpinner(SpinnerType.BallAtom);
    const fileResponse  = await this.dashboardService.getPdf();
    
    // Create a Blob from the file contents
    const binaryString = window.atob(fileResponse.fileContents);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create Blob from binary array buffer
    const blob = new Blob([bytes], { type: 'application/pdf' });

    // Save the Blob as a PDF file
    await saveAs(blob, fileResponse.fileDownloadName);

    this.hideSpinner(SpinnerType.BallAtom);
  }
}
