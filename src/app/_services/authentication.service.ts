import { Injectable } from '@angular/core';
//import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as decode from 'jwt-decode';

@Injectable()
export class AuthenticationService {
  //private api_site = 'http://enigma.posdata.it:3000';
  private api_site = 'http://localhost:3000';

  public token: string;

  constructor(private http: HttpClient) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string, remember: number): Observable<boolean> {
    return this.http.post(this.api_site + '/users/auth', { username: username, password: password, remember: remember })
    .map((response: HttpResponse<any>) => { 
      //console.log(response.status) 
      if(response.status == 200) {
        let token = response.body.token;
        let logo = response.body.logo;
        let tokenPayload = decode(token);
        localStorage.setItem('currentUser', JSON.stringify({ id: tokenPayload.data.id, username: username, firstname: tokenPayload.data.firstname, lastname: tokenPayload.data.lastname, role: tokenPayload.data.role, token: token, logo: logo }));
        return true;
      }
      else {
        return false;
      }
    });
  }

  signup(firstname: string, lastname: string, username: string, password: string, customer_id: string, email: string, role: number): Observable<any> {
    return this.http.post<any>(this.api_site + '/users', { username: username, password: password, firstname: firstname, lastname: lastname, email: email, role: role, telegram_id: 'undefined', customer_id: customer_id})
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
