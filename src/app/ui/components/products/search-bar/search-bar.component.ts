import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith, switchMap } from 'rxjs';
import { List_Product } from 'src/app/contracts/product/list_product';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Output() searchStringChange = new EventEmitter<string>();
  searchBar = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchString: string = '';

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    this.filteredOptions = this.searchBar.valueChanges.pipe(
      startWith(''),
      switchMap(async (value: string) => {
        let result;
        if (this.searchBar.value.length > 2) {
          result = await this.productService.readFilterName(value);
        } else {
          result = [];
        }
        return result;
      })
    );
  }

  search() {
    this.searchStringChange.emit(this.searchBar.value.trim());
  }
}
