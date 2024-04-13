import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { User_Access_Role } from 'src/app/contracts/users/user_access_roles';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { UserService } from 'src/app/services/common/models/user.service';

@Component({
  selector: 'app-update-user-access',
  templateUrl: './update-user-access.component.html',
  styleUrls: ['./update-user-access.component.scss'],
})
export class UpdateUserAccessComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['userName', 'email', 'accessRole'];
  roles = ['Admin', 'Employee', 'User'];
  dataSource: MatTableDataSource<User_Access_Role> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    spinner: NgxSpinnerService,
    private userService: UserService,
    private alertifytService: AlertifyService
  ) {
    super(spinner);
  }
  ngOnInit(): void {
    this.GetUserAccessRoles();
  }

  async GetUserAccessRoles() {
    this.showSpinner(SpinnerType.BallAtom);
    const UserAccessRoles: {
      totalCount: number;
      userAccessLists: User_Access_Role[];
    } = await this.userService.GetAllUserAccessRoles(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5
    );

    this.paginator.length = UserAccessRoles.totalCount;
    this.dataSource = new MatTableDataSource<User_Access_Role>(
      UserAccessRoles.userAccessLists
    );
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async changeRole(role: string, id: string) {
    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.userService.UpdateUserAccess(id, role).then(() => {
      this.alertifytService.message('Successfully updated', {
        messageType: MessageType.Success,
        position: Position.TopRight,
      });
    });
    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }

  async pageChanged() {
    await this.GetUserAccessRoles();
  }
}
