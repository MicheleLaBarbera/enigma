import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as decode from 'jwt-decode';

@Injectable()
export class AuthenticationService {

  public token: string;

  constructor(private http: Http) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post('http://localhost/api/users/auth', JSON.stringify({ username: username, password: password }))
    .map((response: Response) => {
      let token = response.json() && response.json().token;
      if (token) {
        this.token = token;
        let tokenPayload = decode(token);
        localStorage.setItem('currentUser', JSON.stringify({ id: tokenPayload.data.id, username: username, firstname: tokenPayload.data.firstname, lastname: tokenPayload.data.lastname, token: token }));
        return true;
      }
      else {
        return false;
      }
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
