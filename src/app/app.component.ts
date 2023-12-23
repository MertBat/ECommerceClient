import { Component } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { Route, Router } from '@angular/router';
declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(public authService:AuthService, private toasterService:CustomToastrService, private router:Router){
    authService.identityCheck();
  }

  signOut(){
    this.authService.logOut();
    this.toasterService.message("Account Successfuly Logout", "Logout",{
      position: ToastrPosition.TopRight,
      messageType: ToastrMessageType.Info
    })
    this.router.navigate(['login']);
  }
}
