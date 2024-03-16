import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent extends BaseComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean = false;

  constructor(
    spinner: NgxSpinnerService,
    private formbuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private alertifyService:AlertifyService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.frm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit(data: any) {
    this.submitted = true;
    if (this.frm.invalid) {
      return;
    }
    console.log(data['email']);
    this.showSpinner(SpinnerType.BallScaleMultiple);
    this.userAuthService.passwordReset(data['email'], () => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
    });
    this.alertifyService.message("Email successfully sent", {
      messageType: MessageType.Success,
      position: Position.TopRight
    })
  }
}
