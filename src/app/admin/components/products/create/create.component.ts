import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_product } from 'src/app/contracts/product/create_product';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent extends BaseComponent implements OnInit {
  @Output() createdProduct: EventEmitter<Create_product> = new EventEmitter();
 
  constructor(
    private productService: ProductService,
    spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(spinner);
  }

  ngOnInit(): void {}

  create(
    name: HTMLInputElement,
    sock: HTMLInputElement,
    price: HTMLInputElement
  ) {
    this.showSpinner(SpinnerType.BallAtom);
    const create_product: Create_product = new Create_product();
    create_product.name = name.value;
    create_product.stock = parseInt(sock.value);
    create_product.price = parseFloat(price.value);

    this.productService.create(
      create_product,
      () => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.alertify.message('Ürün başarıyla eklenmiştir.', {
          messageType: MessageType.Success,
          position: Position.TopRight,
          dismissOthers: true,
        });
        this.createdProduct.emit(create_product);
      },
      (errorMessage) => {
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight,
        });
      }
    );
  }
}
