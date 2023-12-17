import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { LoginProduct } from 'src/app/contracts/users/login_product';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, spinner: NgxSpinnerService) {
    super(spinner)
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      userNameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get component() {
    return this.frm.controls;
  }

  async onSubmit(data: LoginProduct) {
    this.submitted = true;
    if (this.frm.invalid) {
      return;
    }
    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.userService.login(data, ()=>{
      this.hideSpinner(SpinnerType.BallScaleMultiple)
    });
  }
}
