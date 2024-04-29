import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';

import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends BaseComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toasterService: CustomToastrService,
    private router: Router,
    spinner: NgxSpinnerService
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
          ],
        ],
        userName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
          ],
        ],
        eMail: [
          '',
          [Validators.required, Validators.maxLength(250), Validators.email],
        ],
        password: ['', [Validators.required]],
        passwordAgain: ['', [Validators.required]],
      },
      {
        Validators: (group: AbstractControl): ValidationErrors | null => {
          let password = group.get('password').value;
          let passwordAgain = group.get('passwordAgain').value;
          return password === passwordAgain ? null : { notSame: true };
        },
      }
    );
  }

  get component() {
    return this.frm.controls;
  }

  async onSubmit(data: User) {
    this.submitted = true;
    if (this.frm.invalid || this.component.passwordAgain.invalid) {
      return;
    }
    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.userService.create(data).then(() => {
      this.router.navigate(['/login']);
      this.toasterService.message('Account Successfully Created', 'Success', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    });
    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }
}
