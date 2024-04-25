import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: DashboardComponent }
    ]),
    MatListModule,
    MatRippleModule
  ]
})
export class DashboardModule { }
