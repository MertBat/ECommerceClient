import {
  FacebookLoginProvider,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { LoginProduct } from 'src/app/contracts/users/login_product';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';

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
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private userAuthService:UserAuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    super(spinner);
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.showSpinner(SpinnerType.BallScaleMultiple);

      switch (user.provider) {
        case 'GOOGLE':
          await this.userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallScaleMultiple);
            this.activatedRoute.queryParams.subscribe((params) => {
              const returnUrl = params['returnUrl'] || '/products';
              this.router.navigateByUrl(returnUrl);
            });
          });
          break;
        case 'FACEBOOK':
          userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallScaleMultiple);
            this.activatedRoute.queryParams.subscribe((params) => {
              const returnUrl = params['returnUrl'] || '/products';
              this.router.navigateByUrl(returnUrl);
            });
          });
          break;
      }
    });
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
    await this.userAuthService.login(data, () => {
      this.authService.identityCheck();
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      this.activatedRoute.queryParams.subscribe((params) => {
        const returnUrl = params['returnUrl'] || '/products';
        this.router.navigateByUrl(returnUrl);
      });
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
