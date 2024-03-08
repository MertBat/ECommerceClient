import { Component, Inject } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasketItemDeleteState } from '../basket-item-remove-dialog/basket-item-remove-dialog.component';

@Component({
  selector: 'app-basket-shopping-complete-dialog',
  templateUrl: './basket-shopping-complete-dialog.component.html',
  styleUrls: ['./basket-shopping-complete-dialog.component.scss'],
})
export class BasketShoppingCompleteDialogComponent extends BaseDialog<BasketShoppingCompleteDialogComponent> {

  constructor(
    dialogRef: MatDialogRef<BasketShoppingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ShoppingCompleteState
  ) {
    super(dialogRef);
  }
}

export enum ShoppingCompleteState {
  Yes,
  No,
}
