import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { LoginProduct } from 'src/app/contracts/users/login_product';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(spinner);
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
    await this.userService.login(data, () => {
      this.authService.identityCheck();
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      this.activatedRoute.queryParams.subscribe((params) => {
        const returnUrl = params['returnUrl'] || '/products';
        this.router.navigateByUrl(returnUrl);
      });
    });
  }
}
