import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, map, startWith } from 'rxjs';
import { SpinnerType } from 'src/app/base/base.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { AuthoizationEndpointService } from 'src/app/services/common/models/authoization-endpoint.service';
import { RoleService } from 'src/app/services/common/models/role.service';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrls: ['./authorize-menu-dialog.component.scss'],
})
export class AuthorizeMenuDialogComponent
  extends BaseDialog<AuthorizeMenuDialogComponent>
  implements OnInit
{
  separatorKeysCodes: number[] = [ENTER, COMMA];
  roleCtrl = new FormControl('');
  filteredRoles: Observable<string[]>;
  selectedRoles: string[] = [];
  tableRoles: string[] = [];

  @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private roleService: RoleService,
    private spinnerService: NgxSpinnerService,
    private authorizationEndPointService: AuthoizationEndpointService,
    private alertify: AlertifyService
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    this.spinnerService.show(SpinnerType.BallAtom);
    const allRoles = (await this.roleService.getAll()).roles;
    this.selectedRoles =
      await this.authorizationEndPointService.getRolesEndpoint(this.data.code);
    this.tableRoles = allRoles.map((role) => role.name);
    this.filteredRoles = this.roleCtrl.valueChanges.pipe(
      startWith(null),
      map((role: string | null) =>
        role ? this._filter(role) : this.tableRoles.slice()
      )
    );
    this.spinnerService.hide(SpinnerType.BallAtom);
  }

  remove(role: string): void {
    const index = this.selectedRoles.indexOf(role);

    if (index >= 0) {
      this.selectedRoles.splice(index, 1);

      this.announcer.announce(`Removed ${role}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (
      this.tableRoles.some((item) => item == value) &&
      !this.selectedRoles.includes(value)
    ) {
      this.selectedRoles.push(value);
    }

    this.roleInput.nativeElement.value = '';
    this.roleCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tableRoles.filter((item) =>
      item.toLowerCase().includes(filterValue)
    );
  }

  async assignRoles() {
    this.spinnerService.show(SpinnerType.BallScaleMultiple);
    await this.authorizationEndPointService.assignEndPoint(
      this.selectedRoles,
      this.data.code,
      this.data.menuName,
      () => {
        this.alertify.message('Successfuly saved', {
          messageType: MessageType.Success,
          position: Position.TopRight,
        });
      }
    );
    this.spinnerService.hide(SpinnerType.BallScaleMultiple);
  }
}

export enum AuthorizeMenuState {
  Yes,
  No,
}
