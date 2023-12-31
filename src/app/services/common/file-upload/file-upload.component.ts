import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import {
  FileUploadDialogComponent,
  FileUploadDialogState,
} from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import {
  AlertifyService,
  MessageType,
  Position,
} from '../../admin/alertify.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  @Input() options: Partial<FileUploadOptions>;

  constructor(
    private httpService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    private dialogService:DialogService,
    private spinner: NgxSpinnerService
  ) {}

  public files: NgxFileDropEntry[] = [];

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.BallAtom)
        this.httpService
        .post(
          {
            controller: this.options.controller,
            action: this.options.action,
            queryString: this.options.queryString,
            headers: new HttpHeaders({ responseType: 'blob' })
          },fileData)
        .subscribe(
          (data) => {
            const message = 'Files successfully save';
            this.spinner.hide(SpinnerType.BallAtom)
            if (this.options.isAdminPage) {
              this.alertifyService.message(message, {
                dismissOthers: true,
                messageType: MessageType.Success,
                position: Position.TopRight,
              });
            } else {
              this.customToastrService.message(message, 'Success', {
                messageType: ToastrMessageType.Success,
                position: ToastrPosition.TopRight,
              });
            }           
          },
          (errorResponse: HttpErrorResponse) => {
            const message = 'Something went wrong';
            this.spinner.hide(SpinnerType.BallAtom)
            if (this.options.isAdminPage) {
              this.alertifyService.message(message, {
                dismissOthers: true,
                messageType: MessageType.Error,
                position: Position.TopRight,
              });
            } else {
              this.customToastrService.message(message, 'Fail!', {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopRight,
              });
            }
          }
        );
      },
    })
  }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean;
}
