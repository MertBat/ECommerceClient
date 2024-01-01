import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { LoginProduct } from 'src/app/contracts/users/login_product';
import { User } from 'src/app/entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpService: HttpClientService,
    private toastrService: CustomToastrService
  ) {}

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> = this.httpService.post<
      Create_User | User
    >(
      {
        controller: 'users',
      },
      user
    );

    return (await firstValueFrom(observable)) as Create_User;
  }

  async login(user: LoginProduct, callback?: () => void): Promise<void> {
    const observable: Observable<LoginProduct | TokenResponse> =
      this.httpService.post<LoginProduct | TokenResponse>(
        {
          controller: 'users',
          action: 'login',
        },
        user
      );
    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;
    if (TokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
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
          controller: 'users',
        },
        user
      );

    const tokenResponse = (await firstValueFrom(observable)) as TokenResponse;
    callback();
    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);
      this.toastrService.message('Google access accepted', 'Success', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }else{
      this.toastrService.message('Google access denied', 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
    }
  }

  async facebookLogin(user: SocialUser, callback?: () => void): Promise<any> {
    const observable: Observable<SocialUser | TokenResponse> =
      this.httpService.post<SocialUser | TokenResponse>(
        {
          controller: 'users',
          action: 'facebook-login',
        },
        user
      );

    const tokenResponse: TokenResponse = (await firstValueFrom(
      observable
    )) as TokenResponse;

    if (tokenResponse) {
      localStorage.setItem('accessToken', tokenResponse.token.accessToken);

      this.toastrService.message('Facebook access accepted', 'Success', {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
      });
    }else{
      this.toastrService.message('Facebook access denied', 'Error', {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
      });
    }

    callback();
  }
}
