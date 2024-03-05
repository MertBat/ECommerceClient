import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';
import { BasketService } from 'src/app/services/common/models/basket.service';

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss'],
})
export class BasketsComponent extends BaseComponent implements OnInit {
  basketItems: List_Basket_Item[];

  constructor(
    spinner: NgxSpinnerService,
    private basketService: BasketService
  ) {
    super(spinner);
  }

  async ngOnInit(): Promise<void> {
    this.basketItems = await this.basketService.get();
  }

  async decreaseQuantity(basketItem: List_Basket_Item) {
    this.showSpinner(SpinnerType.BallAtom);
    const updatedBasketItem: Update_Basket_Item = {
      basketItemId: basketItem.basketItemId,
      quantity: basketItem.quantity - 1,
    };

    if (updatedBasketItem.quantity === 0) {
      this.basketItems = this.basketItems.filter(
        (item) => item.basketItemId !== basketItem.basketItemId
      );
      await this.basketService.delete(basketItem.basketItemId);
    } else {
      this.basketItems.map((item) => {
        if (basketItem.basketItemId == item.basketItemId) {
          item.quantity--;
        }
        return item;
      });
      await this.basketService.put(updatedBasketItem);
    }

    this.hideSpinner(SpinnerType.BallAtom);
  }

  async increaseQuantity(basketItem: List_Basket_Item) {
    this.showSpinner(SpinnerType.BallAtom);
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

    await this.basketService.put(updatedBasketItem);
    this.hideSpinner(SpinnerType.BallAtom);
  }
}
