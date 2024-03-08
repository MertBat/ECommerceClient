import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    RouterModule.forChild([
      {path: "", component: ProductsComponent}
    ])
  ]
})
export class ProductsModule { }
