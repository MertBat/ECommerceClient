import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Addresses } from 'src/app/contracts/address/list_addresses';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import {
  AddAddressDialogComponent,
  AddAddressDialogStatus,
} from 'src/app/dialogs/add-address-dialog/add-address-dialog.component';
import {
  DeleteDialogComponent,
  DeleteState,
} from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { UpdateAddressDialogComponent } from 'src/app/dialogs/update-address-dialog/update-address-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { AddressService } from 'src/app/services/common/models/address.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends BaseComponent implements OnInit {
  addresses: List_Addresses[] = [];
  basketItems: List_Basket_Item[];
  totalPrice: number;
  selectedAddressId: string;

  constructor(
    spinner: NgxSpinnerService,
    private addressService: AddressService,
    private dialogService: DialogService,
    private toastrService: CustomToastrService,
    private basketService: BasketService,
    private orderService: OrderService,
    private router: Router
  ) {
    super(spinner);
  }

  async ngOnInit() {
    this.showSpinner(SpinnerType.BallAtom);
    await this.getAllAddresses();
    this.basketItems = await this.basketService.get();
    this.totalPrice = this.basketItems.reduce(
      (sum, item) => sum + item.price,
      0
    );
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async getAllAddresses() {
    this.addresses = await this.addressService.getAll();
  }

  clicked(id: string) {
    const cards = document.getElementsByClassName('focus-card');
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLInputElement;
      card.classList.remove('focus-card');
    }

    this.selectedAddressId = id;

    const focusCard = document.getElementsByClassName(
      'card' + id
    )[0] as HTMLInputElement;
    focusCard.classList.add('focus-card');
  }

  async addAddress() {
    this.dialogService.openDialog({
      componentType: AddAddressDialogComponent,
      data: AddAddressDialogStatus.Create,
      afterClosed: async () => {
        await this.getAllAddresses();
        this.hideSpinner(SpinnerType.BallScaleMultiple);
      },
    });
  }

  async updateAddress(id: string) {
    this.showSpinner(SpinnerType.BallAtom);
    this.dialogService.openDialog({
      componentType: UpdateAddressDialogComponent,
      data: id,
      afterClosed: async () => {
        await this.getAllAddresses();
        this.hideSpinner(SpinnerType.BallScaleMultiple);
      },
    });
  }

  async deleteAddress(id: string) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallScaleMultiple);
        await this.addressService.delete(id).then(() => {
          if (id == this.selectedAddressId) {
            this.selectedAddressId = null;
          }
          this.addresses = this.addresses.filter((item) => item.id !== id);
          this.toastrService.message('Successfully deleted', 'Success', {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight,
          });
        });
        this.hideSpinner(SpinnerType.BallScaleMultiple);
      },
    });
  }

  async orderNow(){
    if(!this.addresses.some((item)=> item.id == this.selectedAddressId)){
      this.toastrService.message('Address not found please select address', 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
      return;
    }

    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.orderService.create(this.selectedAddressId).then(()=>{
      this.toastrService.message('Order received', 'Order', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
      this.router.navigate(['/']);
    });
    this.hideSpinner(SpinnerType.BallScaleMultiple);
    
  }
}
