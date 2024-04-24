import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/common/models/order.service';
import { SingleOrder } from 'src/app/contracts/order/single_order';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import {
  ComplateOrderItemState,
  CompleteOrderDialogComponent,
} from '../complete-order-dialog/complete-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { OrderStatueChangeService } from 'src/app/services/admin/order-statue-change.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss'],
})
export class OrderDetailDialogComponent
  extends BaseDialog<OrderDetailDialogComponent>
  implements OnInit
{
  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();
  singleOrder: SingleOrder;
  orderPrice: number;

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ORderDetailDialogState | string,
    private orderService: OrderService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private alertifyService: AlertifyService,
    private orderStatueChangeService: OrderStatueChangeService
  ) {
    super(dialogRef);
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show(SpinnerType.BallAtom)
    this.singleOrder = await this.orderService.getOrderById(
      this.data as string
    );
    this.spinner.hide(SpinnerType.BallAtom)
    this.dataSource = this.singleOrder.basketItems;
    this.orderPrice = this.singleOrder.basketItems
      .map((basketItem) => basketItem.price * basketItem.quantity)
      .reduce((price, current) => price + current);
  }

  completeOrder() {
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data: null,
      afterClosed: async (result) => {
        this.spinner.show(SpinnerType.BallScaleMultiple)
        var status = result == ComplateOrderItemState.Yes
        await this.orderService.completeOrder(this.data as string, status).then(()=>{
          this.alertifyService.message("Order statue successfully changed",{
            messageType: MessageType.Success,
            position: Position.TopRight
          })
        })
        await this.orderStatueChangeService.getOrders();
        this.spinner.hide(SpinnerType.BallScaleMultiple)
      }
    });
  }
}

export enum ORderDetailDialogState {
  Close,
  OrderCompleted,
}
