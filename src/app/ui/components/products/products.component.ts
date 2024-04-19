import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  searchString: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  onSearchStringChange(searchString: string) {
    this.searchString = searchString;
  }

}
