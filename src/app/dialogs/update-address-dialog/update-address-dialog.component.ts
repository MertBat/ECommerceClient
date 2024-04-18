import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddressService } from 'src/app/services/common/models/address.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';
import { BaseDialog } from '../base/base-dialog';
import { Update_Address } from 'src/app/contracts/address/update_address';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-update-address-dialog',
  templateUrl: './update-address-dialog.component.html',
  styleUrls: ['./update-address-dialog.component.scss'],
})
export class UpdateAddressDialogComponent
  extends BaseDialog<UpdateAddressDialogComponent>
  implements OnInit
{
  addressForm: FormGroup;
  address: Update_Address;

  constructor(
    dialogRef: MatDialogRef<UpdateAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private fb: FormBuilder,
    private addressService: AddressService,
    private spinnerService: NgxSpinnerService,
    private toastrService: CustomToastrService
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.address = await this.addressService.getById(this.data)
    if(!this.address){
      this.toastrService.message('This address could not be reached', 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
      this.dialogRef.close();
    }

    this.addressForm = this.fb.group({
      addressName: [this.address.title, Validators.required],
      address: [this.address.fullAddress, Validators.required],
      city: [this.address.city, Validators.required],
      county: [this.address.county, Validators.required],
    });

    this.spinnerService.hide(SpinnerType.BallAtom);
  }

  async onSubmit() {
    if (this.addressForm.valid) {
      this.address.city = this.addressForm.value.city.trim();
      this.address.county = this.addressForm.value.county.trim();
      this.address.title = this.addressForm.value.addressName.trim();
      this.address.fullAddress = this.addressForm.value.address.trim();

      this.spinnerService.show(SpinnerType.BallScaleMultiple);
      await this.addressService.update(this.address).then(() => {
        this.toastrService.message('Successfully updated', 'Success', {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight,
        });
      });
    }
  }
}
