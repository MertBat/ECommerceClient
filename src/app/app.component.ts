import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, _isAuthenticated } from './services/common/auth.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from './services/ui/custom-toastr.service';
import { ComponentName, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { CardItemCountService } from './services/ui/card-item-count.service';
import { Observable, Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  @ViewChild(DynamicLoadComponentDirective,{static: true})
  dynamicLoadComponentDirective : DynamicLoadComponentDirective;
  count:Observable<number>;

  constructor(
    public authService: AuthService,
    private toastrService: CustomToastrService,
    private router: Router,
    private dynamicLoadComponentService:DynamicLoadComponentService,
    private socialAuthService: SocialAuthService,
    private cardItemCountService: CardItemCountService
  ) {
    authService.identityCheck();
    this.count = this.cardItemCountService.count$
  }

  async ngOnInit(){
    if(_isAuthenticated){
      await this.cardItemCountService.getCardItemCount();
    }

  }

  signOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.socialAuthService.signOut();
    this.authService.identityCheck();
    this.router.navigate(['']);
    this.toastrService.message('Oturum kapatılmıştır!', 'Oturum Kapatıldı', {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight,
    });
    this.cardItemCountService.setNull();
  }

  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(ComponentName.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef);
  }
}
