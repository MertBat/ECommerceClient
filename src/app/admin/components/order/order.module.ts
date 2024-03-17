import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DeleteDirectiveModule } from 'src/app/directives/admin/delete/delete.directive.module';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { ListComponent } from './list/list.component';
import { OrderComponent } from './order.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [OrderComponent, ListComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    RouterModule.forChild([{ path: '', component: OrderComponent }]),
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DialogModule,
    FileUploadModule,
    DeleteDirectiveModule,
    MatIconModule,
    MatTooltipModule
  ],
})
export class OrderModule {}
