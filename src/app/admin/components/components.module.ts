import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsModule,
    OrderModule,
    DashboardModule,
    CustomerModule,
    AuthorizeMenuModule
  ],
})
export class ComponentsModule {}
