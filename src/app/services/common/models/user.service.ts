import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, observable } from 'rxjs';
import { User } from 'src/app/entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { CustomToastrService } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

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

  async updatePassword(
    userId: string,
    resetToken: string,
    password: string,
    confirmpassword: string,
    successCallBack?: ()=> void,
    errırCallBack?: (error)=> void
  ) {
    const updatePasswordObservable: Observable<any> = this.httpService.post(
      {
        controller: 'users',
        action: 'update-password',
      },
      {
        userId: userId,
        resetToken: resetToken,
        newpassword: password,
        passwordConfirm: confirmpassword,
      }
    );
   return await firstValueFrom(updatePasswordObservable);
  }
}
