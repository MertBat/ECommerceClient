import { Injectable } from '@angular/core';
import { BasketService } from '../common/models/basket.service';
import { Subject} from 'rxjs';
import { ContentObserver } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class CardItemCountService {

  private count: number = 0;
  countChanged = new Subject<number>();
  count$ = this.countChanged.asObservable();

  constructor(private basketService: BasketService) { }

  async getCardItemCount() {
    const _count:any = await this.basketService.getCount();
    this.count = _count.count;
    this.notifyCountChanged();
  }

  addCount() {
    this.count++;
    this.notifyCountChanged();
  }

  removeCount() {
    if (this.count > 0) {
      this.count--;
      this.notifyCountChanged();
    }
  }

  setZero(){
    this.count = 0;
  }

  setNull(){
    this.count = null;
  }

  private notifyCountChanged() {
    console.log("notifiy", this.count)
    this.countChanged.next(this.count);
  }
}

