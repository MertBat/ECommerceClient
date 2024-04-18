import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: OrderComponent }]),
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class OrderModule { }import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

