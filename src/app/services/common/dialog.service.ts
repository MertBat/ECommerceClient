import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  openDialog(dialogParameters: Partial<DialogParameters>): void {
    const dialogRef = this.dialog.open(dialogParameters.componentType, {
      width: dialogParameters.options?.width,
      height: dialogParameters.options?.height,
      position: dialogParameters.options?.position,
      data: dialogParameters.data,
      panelClass: "warning-dialog"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogParameters.data == null){
        if (result !== undefined && result !== null)
          dialogParameters.afterClosed(result);
      }else{
        if (result == dialogParameters.data)
          dialogParameters.afterClosed();
      }
    });
  }
}

export class DialogParameters {
  componentType: ComponentType<any>;
  data: any;
  afterClosed: (data?:any) => void;
  options?: Partial<DialogOptions> = new DialogOptions();
}

export class DialogOptions {
  width?: string = "250px";
  height?: string;
  position?: DialogPosition;
}
