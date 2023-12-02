import { Component, OnInit, ViewChild } from '@angular/core';
import { Create_product } from 'src/app/contracts/create_product';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(ListComponent) listComponents: ListComponent

  constructor() {}

  ngOnInit(): void {
   
  }

  createdProduct(createdProduct: Create_product){
    this.listComponents.getProducts();
  }
}
