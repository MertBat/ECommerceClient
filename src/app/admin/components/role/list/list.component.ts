import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Role } from 'src/app/contracts/role/list_role';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Role> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(spinner: NgxSpinnerService, private roleService: RoleService) {
    super(spinner);
  }

  async getRoles() {
    this.showSpinner(SpinnerType.BallAtom);
    const allRoles: { totalCount: number; roles: List_Role } =
      await this.roleService.getAll(
        this.paginator ? this.paginator.pageIndex : 0,
        this.paginator ? this.paginator.pageSize : 5
      );
    this.hideSpinner(SpinnerType.BallAtom);
    const convertArray = Object.entries(allRoles.roles).map(([id, name]) => ({
      id,
      name,
    }));
    this.paginator.length = allRoles.totalCount;
    this.dataSource = new MatTableDataSource<List_Role>(convertArray);
  }

  async ngOnInit() {
    await this.getRoles();
  }

  async pageChanged() {
    await this.getRoles();
  }
}
