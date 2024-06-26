import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Observable, firstValueFrom, observable } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { LoginProduct } from 'src/app/contracts/users/login_product';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(
    private httpService: HttpClientService,
    private toastrService: CustomToastrService
  ) {}

  async login(user: LoginProduct, callback?: () => void): Promise<void> {
    const observable: Observable<LoginProduct | TokenResponse> =
      this.httpService.post<LoginProduct | TokenResponse>(
        {
          controller: 'auth',
          action: 'login',
        },
        user
      );
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      this.toastrService.message('SignIn is Successful', 'Success', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }
    callback();
  }

  async googleLogin(user: SocialUser, callback?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpService.post<SocialUser | TokenResponse>(
        {
          action: 'google-login',
          controller: 'auth',
        },
        user
      );

    const tokenResponse = (await firstValueFrom(observable)) as TokenResponse;
    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      this.toastrService.message('Google access accepted', 'Success', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    } else {
      this.toastrService.message('Google access denied', 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
    }
    callback();
  }

  async facebookLogin(user: SocialUser, callback?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpService.post<SocialUser | TokenResponse>(
        {
          controller: 'auth',
          action: 'facebook-login',
        },
        user
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);

      this.toastrService.message('Facebook access accepted', 'Success', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    } else {
      this.toastrService.message('Facebook access denied', 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
    }

    callback();
  }

  async refreshTokenLogin(
    refreshToken: string,
    callback?: (state) => void
  ): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpService.post(
      {
        action: 'refreshTokenLogin',
        controller: 'auth',
      },
      { refreshToken: refreshToken }
    );
    try {
      const tokenResponse: TokenResponse = (await firstValueFrom(
        observable
      )) as TokenResponse;

      if (tokenResponse) {
        localStorage.setItem('accessToken', tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      }
      callback(tokenResponse ? true : false);
    } catch {
      callback(false);
    }
  }

  async passwordReset(email: string, callback?: () => void) {
    const passwordResetObservable: Observable<any> = this.httpService.post(
      {
        controller: 'auth',
        action: 'password-reset',
      },
      { email: email }
    );

    await firstValueFrom(passwordResetObservable);
    callback();
  }

  async verifyResetToken(resetToken: string, userId: string): Promise<boolean> {
    const verifyObservable: Observable<any> = this.httpService.post(
      {
        controller: 'auth',
        action: 'verify-reset-token',
      },
      {
        resetToken: resetToken,
        userId: userId,
      }
    );
    return await firstValueFrom(verifyObservable);
  }
}
