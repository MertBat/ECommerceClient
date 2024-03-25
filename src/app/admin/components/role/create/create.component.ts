import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { RoleService } from 'src/app/services/common/models/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent extends BaseComponent implements OnInit {
  @Output() createdRole: EventEmitter<string> = new EventEmitter();

  constructor(
    spinner: NgxSpinnerService,
    private roleService: RoleService,
    private alertify: AlertifyService
  ) {
    super(spinner);
  }

  ngOnInit(): void {}

  async create(name: HTMLInputElement) {
    const nameValue = name.value
    if(nameValue.includes(" ")){
      this.alertify.message('Role can not include space', {
        messageType: MessageType.Warning,
        position: Position.TopRight,
        dismissOthers: true,
      });
      return;
    }
    this.showSpinner(SpinnerType.BallAtom);
    const firstLetterUpperCase = nameValue.charAt(0).toUpperCase() + nameValue.slice(1);
    await this.roleService.create(firstLetterUpperCase);
    this.hideSpinner(SpinnerType.BallAtom);
    this.alertify.message('Role successfully added', {
      messageType: MessageType.Success,
      position: Position.TopRight,
      dismissOthers: true,
    });
    this.createdRole.emit(nameValue);
  }
}
