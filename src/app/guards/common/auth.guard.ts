import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private toasterService: CustomToastrService,
    private spinner: NgxSpinnerService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.spinner.show(SpinnerType.BallScaleMultiple);

    if (!_isAuthenticated) {
      debugger;
      this.router.navigate(['login'], {
        queryParams: { returnUrl: state.url },
      });
      this.toasterService.message('Please login', 'Unauthorized Access', {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight,
      });
      this.spinner.hide(SpinnerType.BallScaleMultiple);
      return false;
    }

    this.spinner.hide(SpinnerType.BallScaleMultiple);

    return true;
  }
}
