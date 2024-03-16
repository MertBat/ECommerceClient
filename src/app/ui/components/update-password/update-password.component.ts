import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { UserService } from 'src/app/services/common/models/user.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss'],
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean = false;
  state: boolean = false;
  userId: string;
  resetToken: string;

  constructor(
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastrService: CustomToastrService,
    private router: Router,
    private userAuthService: UserAuthService,
    private activateRoute: ActivatedRoute,
    private userService: UserService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe({
      next: async (params) => {
        this.showSpinner(SpinnerType.BallScaleMultiple);
        var verifyState;
        this.userId = params['userId'];
        this.resetToken = params['resetToken'];
        verifyState = await this.userAuthService.verifyResetToken(
          this.resetToken,
          this.userId
        );
        this.state = verifyState.state;
        this.hideSpinner(SpinnerType.BallScaleMultiple);
      },
    });
    this.frm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        rePassword: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password').value;
    const rePassword = group.get('rePassword').value;
    return password === rePassword ? null : { notMatched: true };
  }

  async onSubmit() {
    this.submitted = true;
    if (this.frm.invalid) {
      return;
    }
    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.userService
      .updatePassword(
        this.userId,
        this.resetToken,
        this.frm.value['password'],
        this.frm.value['rePassword']
      )
      .then(() => {
        this.toastrService.message('Password Successfully updated', 'Success', {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight,
        });
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        this.toastrService.message(error, 'Error', {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight,
        });
      });
    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }
}
