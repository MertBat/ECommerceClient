import { Component, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { List_Product_Image } from 'src/app/contracts/product/list_product_image';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BaseDialog } from '../base/base-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { MatCard } from '@angular/material/card';
import { DialogService } from 'src/app/services/common/dialog.service';
import {
  DeleteDialogComponent,
  DeleteState,
} from '../delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';

declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss'],
})
export class SelectProductImageDialogComponent
  extends BaseDialog<SelectProductImageDialogComponent>
  implements OnInit
{
  images: List_Product_Image[];
  defaultImagePath = "../../../assets/default-box.jpg"

  constructor(
    dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private alertifyService: AlertifyService
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.spinner.show(SpinnerType.BallAtom);
    this.images = await this.productService.readImages(
      this.data as string,
      () => {
        this.spinner.hide(SpinnerType.BallAtom);
      }
    );
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: '.png, .jpg, .jpeg, .gif',
    action: 'upload',
    controller: 'products',
    explanation: 'Please pick product images',
    isAdminPage: true,
    queryString: `id=${this.data}`,
  };

  async deleteImage(imageId: string, event: any) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);
        await this.productService.deleteImage(
          this.data as string,
          imageId,
          () => {
            this.spinner.hide(SpinnerType.BallAtom);
            var card = $(event.srcElement).parent().parent().parent();
            card.fadeOut(500);
          }
        ), (errorMessage) =>{
          this.spinner.hide(SpinnerType.BallAtom);
        };
        ;
      },
    });
  }

  async showcase(imageId:string){
    this.spinner.show(SpinnerType.BallAtom);
    await this.productService.changeShowcaseImage(imageId, this.data  as string,()=>{
      this.alertifyService.message("Showcase picture set", {
        messageType: MessageType.Success,
        position: Position.TopRight
      })
    });
    this.spinner.hide(SpinnerType.BallAtom);
  }
  
  setDefaultImage(e:any){
    e.target.src = this.defaultImagePath;
  }
}

export enum SelectProductImageState {
  Close,
}
