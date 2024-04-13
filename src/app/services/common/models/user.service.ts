import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, observable } from 'rxjs';
import { User } from 'src/app/entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { CustomToastrService } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';
import { List_User } from 'src/app/contracts/users/list_user';
import { User_Access_Role } from 'src/app/contracts/users/user_access_roles';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClientService: HttpClientService) {}

  async create(user: User): Promise<Create_User> {
    const observable: Observable<Create_User | User> =
      this.httpClientService.post<Create_User | User>(
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
    confirmpassword: string
  ) {
    const updatePasswordObservable: Observable<any> =
      this.httpClientService.post(
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

  async getAll(
    page: number = 0,
    size: number = 5
  ): Promise<{ totalCount: number; users: List_User[] }> {
    const getAllObservable: Observable<{
      totalCount: number;
      users: List_User[];
    }> = this.httpClientService.get({
      controller: 'users',
      queryString: `page=${page}&size=${size}`,
    });

    return await firstValueFrom(getAllObservable);
  }

  async assignRoleToUser(id: string, role: string) {
    const assignObservable: Observable<any> = this.httpClientService.post(
      {
        controller: 'users',
        action: 'assign-role-to-user',
      },
      {
        userId: id,
        role: role,
      }
    );

    return await firstValueFrom(assignObservable);
  }

  async GetAllUserAccessRoles(
    page: number,
    size: number
  ): Promise<{ totalCount: number; userAccessLists: User_Access_Role[] }> {
    const accessRolesObservable: Observable<{
      totalCount: number;
      userAccessLists: User_Access_Role[];
    }> = this.httpClientService.get({
      controller: 'users',
      action: 'get-all-user-access-roles',
      queryString: `page=${page}&size=${size}`,
    });

    return await firstValueFrom(accessRolesObservable);
  }

  async UpdateUserAccess(id: string, role: string) {
    const updateAccessObservable: Observable<any> = this.httpClientService.post(
      {
        controller: 'users',
        action: 'update-user-access',
      },
      {
        id: id,
        role: role,
      }
    );

    return await firstValueFrom(updateAccessObservable);
  }
}
