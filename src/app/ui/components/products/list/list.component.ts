import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { List_Product } from 'src/app/contracts/list_product';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrOptions,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent extends BaseComponent implements OnInit {
  defaultImageUrl = '../../../../../assets/default-box.png';
  products: List_Product[];
  currentPageNo: number;
  totalCount: number;
  totalPageCount: number;
  pageList: number[] = [];

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private basketService: BasketService,
    private spinnerService: NgxSpinnerService,
    private toasterService: CustomToastrService
  ) {
    super(spinnerService);
  }

  ngOnInit() {
    this.showSpinner(SpinnerType.BallAtom);
    this.activatedRoute.params.subscribe(async (params) => {
      this.spinnerService.show();
      this.currentPageNo = parseInt(params['pageNo'] ?? 1);
      const data: { totalCount: number; products: List_Product[] } =
        await this.productService.read(
          this.currentPageNo - 1,
          8,
          () => {
            this.hideSpinner(SpinnerType.BallAtom);
          },
          (errorMessage) => {
            this.hideSpinner(SpinnerType.BallAtom);
            this.toasterService.message(errorMessage, 'Error', {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight,
            });
          }
        );
      this.products = data.products;

      this.products = this.products.map<List_Product>((p) => {
        const listProduct: List_Product = {
          name: p.name,
          id: p.id,
          price: p.price,
          stock: p.stock,
          createdDate: p.createdDate,
          updatedDate: p.updatedDate,
          imagePath:
            p.productImageFiles.length > 0
              ? p.productImageFiles?.find((p) => p.showcase)
                ? p.productImageFiles?.find((p) => p.showcase).path
                : ''
              : '',
        };
        return listProduct;
      });

      this.totalCount = data.totalCount;
      this.totalPageCount = Math.ceil(this.totalCount / 8);

      this.pageList = [];
      if (this.totalPageCount <= 7) {
        for (let i = 1; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      } else if (this.currentPageNo - 3 <= 0) {
        for (let i = 1; i <= 7; i++) {
          this.pageList.push(i);
        }
      } else if (this.currentPageNo + 3 >= this.totalPageCount) {
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      } else {
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++) {
          this.pageList.push(i);
        }
      }
    });
  }

  getProductImage(product: List_Product) {
    if (product.productImageFiles.length != 0) {
      const productImageFile = product.productImageFiles.filter(
        (item) => item.showcase == true
      );
      console.log(productImageFile);
      if (productImageFile.length != 0) {
        return productImageFile[0].path;
      }
    }
    return '';
  }

  async addToBasket(product: List_Product) {
    this.showSpinner(SpinnerType.BallScaleMultiple);
    let _basketItem: Create_Basket_Item = {
      productId: product.id,
      quantity: 1,
    };
    await this.basketService.add(_basketItem);
    this.hideSpinner(SpinnerType.BallScaleMultiple);
    this.toasterService.message('Product added to basket', 'Success', {
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight,
    });
  }

  setDefaultImage(e: any) {
    e.target.src = this.defaultImageUrl;
  }
}
