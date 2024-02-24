import { ContentObserver } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper:JwtHelperService) { }

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
    
    _isAuthenticated = token != null && !expired;
    console.log(_isAuthenticated);
  }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }
}

export let _isAuthenticated: boolean;