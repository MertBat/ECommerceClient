import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Order } from 'src/app/contracts/order/list_order';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { OrderService } from 'src/app/services/common/models/order.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'orderCode',
    'userName',
    'totalPrice',
    'address',
    'description',
    'createdDate',
    'delete'
  ];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  ) {
    super(spinner);
  }

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders(){
    this.showSpinner(SpinnerType.BallAtom);
    const allOrders:{totalOrderCount: number; orders: List_Order[];} = await this.orderService.getAll(
      this.paginator ? this.paginator.pageIndex : 0, 
      this.paginator ? this.paginator.pageSize : 5, 
      () => this.hideSpinner(SpinnerType.BallAtom),
      (errorMessage) =>{
        this.alertifyService.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight,
        })
      }
    );

    this.paginator.length = allOrders.totalOrderCount;
    console.log(allOrders)
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders) 
  }

  async pageChanged(){
    await this.getOrders();
  }
}