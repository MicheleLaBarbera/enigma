import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as decode from 'jwt-decode';

@Injectable()
export class AuthGuard implements CanActivate {
 
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.token) {             
        let tokenPayload = decode(currentUser.token);
        let nowTimestamp = new Date().getTime() / 1000;       
        if(nowTimestamp < tokenPayload.exp) {              
          return true;
        }       
      }
      
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}