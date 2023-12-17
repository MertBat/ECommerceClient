import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { LoginProduct } from 'src/app/contracts/users/login_product';
import { User } from 'src/app/entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService:HttpClientService, private toastrService: CustomToastrService) { }

  async create(user:User) : Promise<Create_User> {
    const observable: Observable<Create_User | User>  = this.httpService.post<Create_User | User>({
      controller: "users",
    }, user);

    return await firstValueFrom(observable) as Create_User;
  }

  async login(user: LoginProduct, callback?: () => void) : Promise<void>{
    const observable: Observable<LoginProduct | TokenResponse> = this.httpService.post<LoginProduct |TokenResponse>({
      controller: "users",
      action: "login"
    }, user)
    const tokenResponse:TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(TokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);

      this.toastrService.message("SignIn is Successful", "Success", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    }
    callback();
  }

}


