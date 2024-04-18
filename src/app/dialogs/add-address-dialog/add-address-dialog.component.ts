import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { Add_Address } from 'src/app/contracts/address/add_address';
import { AddressService } from 'src/app/services/common/models/address.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-add-address-dialog',
  templateUrl: './add-address-dialog.component.html',
  styleUrls: ['./add-address-dialog.component.scss'],
})
export class AddAddressDialogComponent extends BaseDialog<AddAddressDialogComponent> implements OnInit{

  addressForm: FormGroup

  constructor(
    dialogRef: MatDialogRef<AddAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddAddressDialogComponent,
    private fb: FormBuilder,
    private addressService: AddressService,
    private spinnerService: NgxSpinnerService,
    private toastrService: CustomToastrService
  ) {
    super(dialogRef);
  }

  ngOnInit(){
    this.addressForm = this.fb.group({
      addressName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      county: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.addressForm.valid) {
      const address: Add_Address = {
        title: this.addressForm.value.addressName.trim(),
        city: this.addressForm.value.city.trim(),
        county: this.addressForm.value.county.trim(),
        fullAddress: this.addressForm.value.address.trim()
      };
      
      this.spinnerService.show(SpinnerType.BallScaleMultiple);
      await this.addressService.create(address).then(()=>{
        this.toastrService.message("Successfully added","Success",{
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        })
      })
    }
  }
}

export enum AddAddressDialogStatus{
  Create,
  Cancel
}
