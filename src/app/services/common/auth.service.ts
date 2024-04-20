import { ContentObserver } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CardItemCountService } from '../ui/card-item-count.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper:JwtHelperService, private cardItemCountService: CardItemCountService) { }

  identityCheck(){
    const token: string = localStorage.getItem('accessToken');
    let expired: boolean;
    try {
      // const decode = this.jwtHelper.decodeToken(token);
      // const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(token);
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }
    let roles;
    if(token != null){
      const decoded = this.jwtHelper.decodeToken(token)
      roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    _isAuthenticated = token != null && !expired;
    _isCompetent = _isAuthenticated && (roles == "Admin" || roles == "Employee")
    _isAdmin = roles == "Admin"

    if(_isAuthenticated){
      this.cardItemCountService.getCardItemCount();
    }
  }

  get isAdmin(): boolean{
    return _isAdmin;
  }

  get isCompetent(): boolean{
    return _isCompetent;
  }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }
}

export let _isAdmin: boolean;
export let _isCompetent: boolean;
export let _isAuthenticated: boolean;