import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';
import {
  BasketItemDeleteState,
  BasketItemRemoveDialogComponent,
} from 'src/app/dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import {
  BasketShoppingCompleteDialogComponent,
  ShoppingCompleteState,
} from 'src/app/dialogs/basket-shopping-complete-dialog/basket-shopping-complete-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { CardItemCountService } from 'src/app/services/ui/card-item-count.service';
import { CustomToastrService } from 'src/app/services/ui/custom-toastr.service';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss'],
})
export class BasketsComponent extends BaseComponent implements OnInit {
  basketItems: List_Basket_Item[];

  constructor(
    spinner: NgxSpinnerService,
    private basketService: BasketService,
    private dialogService: DialogService,
    private toastrService: CustomToastrService,
    private router: Router,
    private cardItemCountService: CardItemCountService
  ) {
    super(spinner);
  }

  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.BallAtom);
    this.basketItems = await this.basketService.get();
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async decreaseQuantity(basketItem: List_Basket_Item) {
    this.showSpinner(SpinnerType.BallScaleMultiple);
    const updatedBasketItem: Update_Basket_Item = {
      basketItemId: basketItem.basketItemId,
      quantity: basketItem.quantity - 1,
    };

    if (updatedBasketItem.quantity === 0) {
      this.dialogService.openDialog({
        componentType: BasketItemRemoveDialogComponent,
        data: BasketItemDeleteState.Yes,
        afterClosed: async () => {
          this.basketItems = this.basketItems.filter(
            (item) => item.basketItemId !== basketItem.basketItemId
          );
          await this.basketService.delete(basketItem.basketItemId).then(() => {
            this.cardItemCountService.removeCount();
          });
        },
      });
    } else {
      this.basketItems.map((item) => {
        if (basketItem.basketItemId == item.basketItemId) {
          item.quantity--;
        }
        return item;
      });
      await this.basketService.put(updatedBasketItem).then(() => {
        this.cardItemCountService.removeCount();
      });
    }

    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }

  async increaseQuantity(basketItem: List_Basket_Item) {
    this.showSpinner(SpinnerType.BallScaleMultiple);
    const updatedBasketItem: Update_Basket_Item = {
      basketItemId: basketItem.basketItemId,
      quantity: basketItem.quantity + 1,
    };

    this.basketItems.map((item) => {
      if (basketItem.basketItemId == item.basketItemId) {
        item.quantity++;
      }
      return item;
    });

    await this.basketService.put(updatedBasketItem).then(()=>{
      this.cardItemCountService.addCount();
    });
    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }

  async shoppingComplete() {
    this.dialogService.openDialog({
      componentType: BasketShoppingCompleteDialogComponent,
      data: ShoppingCompleteState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallAtom);
        $('#basketModal').modal('hide');
        this.router.navigate(['/order']);
      },
    });
  }
}
