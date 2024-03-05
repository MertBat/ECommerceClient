import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {
  constructor(
    private toastrService: CustomToastrService,
    private userAuthService: UserAuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            const refreshToken = localStorage.getItem('refreshToken');
            this.userAuthService
              .refreshTokenLogin(refreshToken, (state) => {
                if (!state) {
                  const url = this.router.url;
                  if (url == '/products') {
                    this.toastrService.message(
                      'Sign in to add products to cart',
                      'Warning',
                      {
                        messageType: ToastrMessageType.Warning,
                        position: ToastrPosition.BottomFullWidth,
                      }
                    );
                  } else {
                    this.toastrService.message(
                      'You have not authorization.',
                      'UnAuthorized!',
                      {
                        messageType: ToastrMessageType.Warning,
                        position: ToastrPosition.BottomFullWidth,
                      }
                    );
                  }
                }
              })
              .then((data) => {});

            break;
          case HttpStatusCode.InternalServerError:
            this.toastrService.message(
              'Client can not reach the server.',
              'Server error!',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            break;
          case HttpStatusCode.BadRequest:
            this.toastrService.message('Wrong request', 'Request!', {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth,
            });
            break;
          case HttpStatusCode.NotFound:
            this.toastrService.message('Page not be found', '404!', {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth,
            });
            break;
          default:
            this.toastrService.message(
              'Encountered an unexpecting error',
              'Unexpected error!',
              {
                messageType: ToastrMessageType.Warning,
                position: ToastrPosition.BottomFullWidth,
              }
            );
            break;
        }
        this.spinner.hide(SpinnerType.BallAtom);
        this.spinner.hide(SpinnerType.BallScaleMultiple);
        this.spinner.hide(SpinnerType.ballSpinClockwiseFadeRotating);
        return of(error);
      })
    );
  }
}
