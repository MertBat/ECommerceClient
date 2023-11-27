import { Component } from '@angular/core';
declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ECommerceClient';
}

console.log($.get("https://localhost:7033/api/Products", data =>{
  console.log(data)
}));