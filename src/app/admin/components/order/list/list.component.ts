import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Order } from 'src/app/contracts/order/list_order';
import { ORderDetailDialogState, OrderDetailDialogComponent } from 'src/app/dialogs/order-detail-dialog/order-detail-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { OrderStatueChangeService } from 'src/app/services/admin/order-statue-change.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OrderService } from 'src/app/services/common/models/order.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'orderStatus',
    'orderCode',
    'userName',
    'totalPrice',
    'address',
    'description',
    'createdDate',
    'viewDetail',
    'delete',
  ];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
    private orderStatueChangeService:OrderStatueChangeService,
    private dialogService: DialogService
  ) {
    super(spinner);
    this.orderStatueChangeService.$order.subscribe((items)=>{
      this.paginator.length = items.totalOrderCount;
      this.dataSource = new MatTableDataSource<List_Order>(items.orders) 
    })
  }

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders(){
    this.showSpinner(SpinnerType.BallAtom);
    const allOrders:{totalOrderCount: number; orders: List_Order[];} = await this.orderService.getAll(
      this.paginator ? this.paginator.pageIndex : 0, 
      this.paginator ? this.paginator.pageSize : 5, 
      () => this.hideSpinner(SpinnerType.BallAtom)
    );

    this.paginator.length = allOrders.totalOrderCount;
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders) 
  }

  async pageChanged(){
    await this.getOrders();
  }

  showDetail(orderId:string){
    this.dialogService.openDialog({
      componentType: OrderDetailDialogComponent,
      data: orderId,
      options:{
        width: '750px'
      },
      afterClosed: ()=> {
        console.log("inside")
      }
    })
  }
}
