import { Injectable } from '@angular/core';
//import { Http, Headers, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as decode from 'jwt-decode';

@Injectable()
export class AuthenticationService {

  public token: string;

  constructor(private http: HttpClient) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post('http://192.168.5.86/api/users/auth', JSON.stringify({ username: username, password: password }))
    .map((response: HttpResponse<any>) => {
      //let token = response.json() && response.json().token;
      //let logo = response.json() && response.json().logo;
      if(response.status == 200) {
        let token = response.body.token;
        let logo = response.body.logo;
        let tokenPayload = decode(token);
        console.log(logo);
        localStorage.setItem('currentUser', JSON.stringify({ id: tokenPayload.data.id, username: username, firstname: tokenPayload.data.firstname, lastname: tokenPayload.data.lastname, token: token, logo: logo }));
        return true;
      }
      else {
        return false;
      }
    });
  }

  signup(firstname: string, lastname: string, username: string, password: string): Observable<any> {
    return this.http.post<any>('http://192.168.5.86/api/users/create', JSON.stringify({ firstname: firstname, lastname: lastname, username: username, password: password}))
    .map((response: HttpResponse<any>) => {
      return response;
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
