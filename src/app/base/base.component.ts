import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from '@angular/core';

export class BaseComponent {

  constructor(private spinner: NgxSpinnerService) {}

  showSpinner(spinnerNameType: SpinnerType){
    this.spinner.show(spinnerNameType);

    // setTimeout(()=>{
    //   this.hideSpinner(spinnerNameType)
    // },3000)
  }
  hideSpinner(spinnerNameType: SpinnerType){
    this.spinner.hide(spinnerNameType);
  }
}

export enum SpinnerType{
  BallAtom = "s2",
  BallScaleMultiple = "s3",
  ballSpinClockwiseFadeRotating = "s1"
}
