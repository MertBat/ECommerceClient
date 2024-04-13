import { Component, ViewChild } from '@angular/core';
import { ListComponent } from './list/list.component';
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent {
  isAdmin:boolean;
  @ViewChild(ListComponent) listComponent: ListComponent;

  constructor(private authService: AuthService) {
    this.isAdmin = authService.isAdmin;
  }

  createdRole(createdRole: string) {
    this.listComponent.getRoles();
  }
}
