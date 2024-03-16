import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PasswordResetComponent } from './password-reset.component';



@NgModule({
  declarations: [
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component: PasswordResetComponent}
    ]),
    ReactiveFormsModule
  ]
})
export class PasswordResetModule { }
