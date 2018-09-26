import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as decode from 'jwt-decode';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {                 
      let tokenPayload = decode(currentUser.token);
      let nowTimestamp = new Date().getTime() / 1000;
      //console.log(tokenPayload.exp)     
      if(nowTimestamp >= tokenPayload.exp) {
        this.router.navigate(['/login']);               
      }
      else {
        request = request.clone({
          setHeaders: {
            Authorization: `${currentUser.token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
