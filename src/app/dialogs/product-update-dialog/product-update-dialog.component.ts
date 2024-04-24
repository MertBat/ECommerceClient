import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/common/models/product.service';
import { Get_Product } from 'src/app/contracts/product/get_product';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-product-update-dialog',
  templateUrl: './product-update-dialog.component.html',
  styleUrls: ['./product-update-dialog.component.scss']
})
export class ProductUpdateDialogComponent extends BaseDialog<ProductUpdateDialogComponent> implements OnInit{

  product: Get_Product;

  constructor(dialogref: MatDialogRef<ProductUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private productService: ProductService,
    private spinnerService: NgxSpinnerService,
    private alertifyService: AlertifyService
  ) {
    super(dialogref);
  }

  async ngOnInit() {
    this.spinnerService.show(SpinnerType.BallAtom)
    this.product = await this.productService.readById(this.data)
    this.spinnerService.hide(SpinnerType.BallAtom)
  }

  async onYesClick(){
    this.spinnerService.show(SpinnerType.BallScaleMultiple)
    await this.productService.update(this.data, this.product).then(()=>{
      this.alertifyService.message("Successfully updated",{
        messageType: MessageType.Success,
        position: Position.TopRight
      })
    })
    this.spinnerService.hide(SpinnerType.BallScaleMultiple)
  }
}
