import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/product/list_product';
import { List_Role } from 'src/app/contracts/role/list_role';
import { List_User } from 'src/app/contracts/users/list_user';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { RoleService } from 'src/app/services/common/models/role.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'userName',
    'nameSurname',
    'email',
    'twoFactor',
    'role',
    'delete',
  ];
  roles: List_Role[] = [];
  selectedValue: string;
  dataSource: MatTableDataSource<List_User> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    spinner: NgxSpinnerService,
    private userService: UserService,
    private roleService: RoleService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  ) {
    super(spinner);
  }

  async ngOnInit() {
    this.showSpinner(SpinnerType.BallAtom);
    var roles = await this.roleService.getAll();
    this.roles = roles.roles;
    await this.getUsers();
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async getUsers() {
    const allUsers: { totalCount: number; users: List_User[] } =
      await this.userService.getAll(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5
      );
    this.paginator.length = allUsers.totalCount;
    this.dataSource = new MatTableDataSource<List_User>(allUsers.users);
  }

  async pageChanged() {
    await this.getUsers();
  }

  async changeRole(role: string, id: string) {
    console.log(role, id);
    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.userService.assignRoleToUser(id, role).then(() => {
      this.alertifyService.message('User role successfully changed', {
        messageType: MessageType.Success,
        position: Position.TopRight,
      });
    });
    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }
}
